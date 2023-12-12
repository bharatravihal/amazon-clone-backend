const Products = require("./models/productsSchema");
const productsdata = require("./constant/productsdata");

const Defaultdata = async () => {
  try {
    await Products.deleteMany({});
    const Storedata = await Products.insertMany(productsdata);
    // console.log(Storedata);
    console.log("products added to database");
  } catch (err) {
    console.log(`erro ${err}`);
  }
};

module.exports = Defaultdata;
