// Logging
import log from "./utils/log";
import { LogType } from "./enums/log";
import { InfoMessage } from "./enums/info";
import { ErrorMessage } from "./enums/error";
//
import express, { Request, Response } from "express";
// Docker
import Docker from "./docker";
import { Container } from "./docker/interfaces/docker";

const app = express();
const port = 3000;

// APIs
const docker = Docker();

// Config Express to parse URL query strings. Do not use default req.query parser.
app.set("query parser", (queryString: string) => {
  return new URLSearchParams(queryString);
});

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

app.get("/docker/containers/list", async (req: Request, res: Response) => {
  try {
    const containers: Container[] = await docker.containers.list();

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

app.get("/docker/containers/:id", async (req: Request, res: Response) => {
  const container_id: string = req.params.id as string;

  if (!container_id) {
    log(
      LogType.error,
      ErrorMessage.MISSING_CONTAINER_ID,
      "Please provide a container ID.",
    );
    res.status(400).json({ error: ErrorMessage.MISSING_CONTAINER_ID });
    return;
  }

  try {
    const container: Container = await docker.containers.info(container_id);

    log(LogType.info, InfoMessage.DOCKER_CONTAINER_LOOKUP);
    res.status(200).json(container);
  } catch (error) {
    log(
      LogType.error,
      ErrorMessage.DOCKER_CONTAINER_LOOKUP_FAILED,
      (error as Error).message,
    );
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER_CONTAINER_LOOKUP_FAILED });
  }
});

app.listen(port, () => {
  log(LogType.info, `Backend API is running on http://0.0.0.0:${port}`);
});
