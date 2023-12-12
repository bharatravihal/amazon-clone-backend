const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const secretKey = process.env.key;

const authenicate = async (req, res, next) => {
  try {
    const token = req.cookies.Amazonweb;

    const verifyToken = jwt.verify(token, secretKey);

    console.log(verifyToken);

    const rootUser = await User.findone({
      _id: verifyToken.id,
      "tokens.token": token,
    });

    console.log(rootUser);

    if (!rootUser) {
      throw new Error("user not found");
    } else {
      req.token = token;
      req.rootUser = rootUser;
      req.userID = rootUser._id;
    }
    next();
  } catch (error) {
    res.status(401).send("un authorised user");
    console.log(error);
  }
};

// module.exports = authenticate;
// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema");
// const keysecret = process.env.KEY;

// const authenicate = async (req, res, next) => {
//   try {
//     const token = req.cookies.eccomerce;

//     const verifyToken = jwt.verify(token, keysecret);

//     const rootUser = await User.findOne({
//       _id: verifyToken._id,
//       "tokens.token": token,
//     });

//     if (!rootUser) {
//       throw new Error("User Not Found");
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userID = rootUser._id;

//     next();
//   } catch (error) {
//     res.status(401).send("Unauthorized:No token provided");
//     console.log(error);
//   }
// };

module.exports = authenicate;
