import express, { Request, Response } from "express";
import dockerApi from "./docker";

const app = express();
const port = 3000;

// APIs
const docker = dockerApi();

app.get("/", (req: Request, res: Response) => {
  docker.listContainers();
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
