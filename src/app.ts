import express, { Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/user/user.route";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to digital-wallet-server");
});

export default app;
