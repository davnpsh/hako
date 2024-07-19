import log from "./utils/log";
import { LogType } from "./enums/log";
import { InfoMessage } from "./enums/info";
import { ErrorMessage } from "./enums/error";
import express, { Request, Response } from "express";
import Docker from "./docker";
import { Container } from "./docker/interfaces/container";

const app = express();
const port = 3000;

// APIs
const docker = Docker();

// Run initial check on Docker socket status
docker.socket.isRunning().then((running) => {
  if (running) {
    log(LogType.info, InfoMessage.DOCKER_SOCKET_RUNNING);
    return;
  }
  log(
    LogType.error,
    ErrorMessage.DOCKER_SOCKET_NOT_RUNNING,
    "You won't be able to use Docker features.",
  );
});

app.get("/docker/socket", async (req: Request, res: Response) => {
  const info = {
    location: docker.socket.location(),
    running: await docker.socket.isRunning(),
  };

  log(LogType.info, InfoMessage.DOCKER_SOCKET_INFORMATION_LOOKUP);
  res.status(200).json(info);
});

app.get("/docker/containers", async (req: Request, res: Response) => {
  try {
    const containers: Container[] = await docker.containers();

    log(LogType.info, InfoMessage.DOCKER_CONTAINERS_LOOKUP);
    res.status(200).json(containers);
  } catch (error) {
    log(
      LogType.error,
      ErrorMessage.DOCKER_CONTAINERS_LOOKUP_FAILED,
      (error as Error).message,
    );
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER_CONTAINERS_LOOKUP_FAILED });
  }
});

app.listen(port, () => {
  log(LogType.info, `Backend API is running on http://0.0.0.0:${port}`);
});
