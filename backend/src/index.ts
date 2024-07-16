import log, { LogType } from "./utils/log";
import express, { Request, Response } from "express";
import Docker from "./docker";

const app = express();
const port = 3000;

// APIs
const docker = Docker();

app.get("/docker/containers", (req: Request, res: Response) => {
  res.send(docker.containers());
});

app.listen(port, () => {
  log(LogType.info, `Backend API is running on http://0.0.0.0:${port}`);
});
