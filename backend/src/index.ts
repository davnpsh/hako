import log, { LogType } from "./utils/log";
import express, { Request, Response } from "express";
import { ErrorType } from "./enums/error";
import { sendError } from "./utils/error";
import { Container } from "./docker/interfaces/container";
import Docker from "./docker";

const app = express();
const port = 3000;

// APIs
const docker = Docker("/var/run/docker.sock");

// check if Docker socket
docker.isRunning().then((isRunning) => {
  if (isRunning === false) {
    log(LogType.error, ErrorType.DOCKER_SOCKET_NOT_RUNNING);
  }
});

app.get("/docker/containers", async (req: Request, res: Response) => {
  let containers: Container[] | ErrorType = await docker.containers();

  if (Array.isArray(containers) === false) {
    sendError(res, 500, containers as ErrorType);
    return;
  }
  res.json(containers);
});

app.listen(port, () => {
  log(LogType.info, `Backend API is running on http://0.0.0.0:${port}`);
});
