const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bodyParser = require("body-parser");
const authenicate = require("../middleware/authenticate");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Use body-parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

//all products data
router.get("/getproducts", async (req, res) => {
  try {
    const data = await Products.find({});
    res.status(201).json(data);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});

// individual products data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const individuadata = await Products.findOne({ id: id });
    //console.log(data);
    res.status(201).json(individuadata);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});

//register data
router.post("/register", async (req, res) => {
  const { fname, email, mobile, password, cpassword } = req.body;
  console.log(req.body);
  if (!fname || !email || !mobile || !password || !cpassword) {
    res.send({ status: 422, msg: "all values are must" });
  } else {
    try {
      const preemail = await User.findOne({ email: email });
      const premobile = await User.findOne({ mobile: mobile });
      if (preemail || premobile) {
        res.send({ status: 409, msg: "email or mobile already exists" });
      } else if (password !== cpassword) {
        res.send({ status: 400, msg: "passwords not matching" });
      } else {
        let hashedpassword;
        hashedpassword = await bcrypt.hash(password, saltRounds);

        console.log(hashedpassword);
        const user = new User({
          fname,
          email,
          mobile,
          password: hashedpassword,
        });
        const storeddata = await user.save();
        console.log(storeddata);
        res.status(201).json({ msg: "suceesfully registered" });
      }
    } catch (err) {
      res.send({ status: 500, error: err });
    }
  }
});

// login user api
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send({ status: 422, error: "all values are must" });
  } else {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.send({ error: "user not found", status: 404 });
      } else {
        const hash = user.password;
        bcrypt.compare(password, hash, async function (err, result) {
          const token = await user.generateAuthtoken();

          res.cookie("Amazonweb", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
            sameSite: "None", // Add this line
            secure: true, // Add this line if your application is served over HTTPS
          });

          console.log(token);
          if (!result) {
            // res.status(400).json({ msg: "passwords not matching" });
            res.send({ msg: "passwords not matching", status: 400 });
          } else {
            res.status(201).json(user);
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
});

// adding data to cart

router.post("/addcart/:id", authenicate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    console.log(cart);
    const UserContact = await User.findOne({ _id: req.userID });
    console.log(UserContact);
    if (UserContact) {
      const cartData = await UserContact.addcartdata();
      await UserContact.save();
      console.log(cartData);
      res.status(201).json(UserContatct);
    } else {
      res.status(401).json({ error: "invalid user" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid user" });
  }
});
// router.post("/addcart/:id", async (req, res) => {
//   try {
//     console.log("perfect 6");
//     const { id } = req.params;
//     const cart = await products.findOne({ id: id });
//     console.log(cart + "cart milta hain");

//     const Usercontact = await User.findOne({ _id: req.userID });
//     console.log(Usercontact + "user milta hain");

//     if (Usercontact) {
//       const cartData = await Usercontact.addcartdata(cart);

//       await Usercontact.save();
//       console.log(cartData + " thse save wait kr");
//       console.log(Usercontact + "userjode save");
//       res.status(201).json(Usercontact);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post("/addcart/:id", (req, res) => {
//   console.log("hi");
// });

module.exports = router;
