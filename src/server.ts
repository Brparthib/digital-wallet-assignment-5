/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/configs/envCon";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";
import { seedDummyUser } from "./app/utils/seedDummyUser";
import { seedDummyAgent } from "./app/utils/seedDummyAgent";

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

(async () => {
  startServer();
  seedAdmin();
  seedDummyAgent();
  seedDummyUser();
})();

// unhandled rejection error handler
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection detected... server shutting down... ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// uncaught exception error handler
process.on("uncaughtException", (err) => {
  console.log("uncaught exception detected... server shutting down... ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// signal termination handler
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... server shutting down... ");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
