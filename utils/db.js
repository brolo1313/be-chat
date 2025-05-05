import mongoose from "mongoose";
import chalk from "chalk";

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

mongoose.plugin((schema) => {
  schema.set("toJSON", {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(successMsg("Connected to DB"));
    
  } catch (error) {
    console.log(errorMsg("DB not connected", error));
  }
};

export default connectDB;
