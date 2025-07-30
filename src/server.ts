import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/envCon";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log(`Connected To DB...!`);

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
