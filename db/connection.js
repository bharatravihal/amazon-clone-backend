const mongoose = require("mongoose");

const connect = async () => {
  await mongoose
    .connect(process.env.connection)
    .then(() => {
      console.log(`mongodb connected`);
    })
    .catch((err) => {
      console.log(`error`, err);
    });
};
connect();
