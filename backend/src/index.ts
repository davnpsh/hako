// Logging
import { InfoMessage } from "./enums/info";
import { ErrorMessage } from "./enums/error";
import logger from "./utils/logger";
import morgan from "morgan";
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

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message: string) => logger.http(message.trim()),
    },
  },
);

app.use(morganMiddleware);

// Run initial check on Docker socket status
docker.socket.isRunning().then((running) => {
  if (running) {
    logger.info(InfoMessage.DOCKER_SOCKET_RUNNING);
    return;
  }
  logger.error(ErrorMessage.DOCKER_SOCKET_NOT_RUNNING);
});

app.get("/docker/socket", async (req: Request, res: Response) => {
  const info = {
    location: docker.socket.location(),
    running: await docker.socket.isRunning(),
  };

  logger.info(InfoMessage.DOCKER_SOCKET_INFORMATION_LOOKUP);
  res.status(200).json(info);
});

app.get("/docker/containers/list", async (req: Request, res: Response) => {
  try {
    const containers: Container[] = await docker.containers.list();

    logger.info(InfoMessage.DOCKER_CONTAINERS_LOOKUP);
    res.status(200).json(containers);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER_CONTAINERS_LOOKUP_FAILED, error);
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER_CONTAINERS_LOOKUP_FAILED });
  }
});

app.get("/docker/containers/:id", async (req: Request, res: Response) => {
  const container_id: string = req.params.id as string;

  if (!container_id) {
    logger.error(ErrorMessage.DOCKER_MISSING_CONTAINER_ID);
    res.status(400).json({ error: ErrorMessage.DOCKER_MISSING_CONTAINER_ID });
    return;
  }

  try {
    const container: Container = await docker.containers.info(container_id);

    logger.info(InfoMessage.DOCKER_CONTAINER_LOOKUP);
    res.status(200).json(container);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER_CONTAINER_LOOKUP_FAILED, error);
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER_CONTAINER_LOOKUP_FAILED });
  }
});

app.listen(port, () => {
  logger.info(`Backend API is running on http://0.0.0.0:${port}`);
});
