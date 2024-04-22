const User = require("../model/User");
const jwt = require("jsonwebtoken"); //decode cookie with jwt.verify()

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); //No cookies? --> Return unauthorized
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false }); //Clear the cookie, to start recycle //SET TO TRUE FOR PRODUCTION

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse!
  if (!foundUser) {
    //No user is found with the token, so the token has already been recycled
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Malformed or expired token --> return forbidden
        // Delete refresh tokens of hacked user
        const hackedUser = await User.findOne({
          //This case a refresh token has been used, but is a valid token.
          username: decoded.username,
        }).exec();
        hackedUser.refreshToken = []; //Empty the array of refreshtokens
        const result = await hackedUser.save();
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  //Remove the old token with Array.filter()
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        // expired refresh token
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);

      // Refresh token was still valid
      //const roles = Object.values(foundUser.roles);
      const userId = foundUser._id;
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            //roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        //creating new token
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      // Creates Secure Cookie with refresh token, respond with the cookie
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: false, //SET TO TRUE FOR PRODUCTION
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, userId }); //Respond with a new accessToken
    }
  );
};

module.exports = { handleRefreshToken };
