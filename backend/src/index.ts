// Logging
import { InfoMessage } from "./definitions/info";
import { ErrorMessage } from "./definitions/error";
import logger from "./utils/logger";
import morgan from "morgan";
//
import express, { Request, Response } from "express";
// Docker
import Docker from "./docker";
import { Container } from "./docker/interfaces/docker";
import { Actions } from "./definitions/actions";

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
app.use(express.json());

// Run initial check on Docker socket status
docker.socket.isRunning().then((running) => {
  if (running) {
    logger.info(InfoMessage.DOCKER.SOCKET.SOCKET_RUNNING);
    return;
  }
  logger.error(ErrorMessage.DOCKER.SOCKET.NOT_RUNNING);
});

app.get("/docker/socket", async (req: Request, res: Response) => {
  const info = {
    location: docker.socket.location(),
    running: await docker.socket.isRunning(),
  };

  logger.info(InfoMessage.DOCKER.SOCKET.INFORMATION_LOOKUP);
  res.status(200).json(info);
});

app.get("/docker/containers/list", async (req: Request, res: Response) => {
  try {
    const containers: Container[] = await docker.containers.list();

    logger.info(InfoMessage.DOCKER.CONTAINERS.LIST_LOOKUP);
    res.status(200).json(containers);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.CONTAINERS.LIST_LOOKUP_FAILED, error);
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER.CONTAINERS.LIST_LOOKUP_FAILED });
  }
});

app.get("/docker/containers/info/:id", async (req: Request, res: Response) => {
  const container_id: string = req.params.id as string;

  if (!container_id) {
    logger.error(ErrorMessage.DOCKER.CONTAINERS.MISSING_ID);
    res.status(400).json({ error: ErrorMessage.DOCKER.CONTAINERS.MISSING_ID });
    return;
  }

  try {
    const container: Container = await docker.containers.info(container_id);

    logger.info(InfoMessage.DOCKER.CONTAINERS.CONTAINER_LOOKUP);
    res.status(200).json(container);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.CONTAINERS.CONTAINER_LOOKUP_FAILED, error);
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER.CONTAINERS.CONTAINER_LOOKUP_FAILED });
  }
});

// Docker containers controls
const docker_container_control =
  (action: string) => async (req: Request, res: Response) => {
    try {
      const { container_id } = req.body;

      if (!container_id) {
        logger.error(ErrorMessage.DOCKER.CONTAINERS.MISSING_ID);
        res
          .status(400)
          .json({ error: ErrorMessage.DOCKER.CONTAINERS.MISSING_ID });
        return;
      }

      let response: number = await docker.containers.control(
        container_id,
        action,
      );

      // Response codes based on:
      // https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerStart
      switch (response) {
        case 204:
        case 304:
          logger.info(InfoMessage.DOCKER.CONTAINERS.CONTAINER_ACTION + action);
          res.status(response).send();
          break;
        default:
          logger.error(
            ErrorMessage.DOCKER.CONTAINERS.CONTAINER_ACTION_FAILED + action,
          );
          res.status(500).json({
            error: ErrorMessage.DOCKER.CONTAINERS.CONTAINER_ACTION_FAILED,
          });
          break;
      }
    } catch (error) {
      logger.error(
        ErrorMessage.DOCKER.CONTAINERS.CONTAINER_ACTION_FAILED + action,
      );
      res.status(500).json({
        error: ErrorMessage.DOCKER.CONTAINERS.CONTAINER_ACTION_FAILED,
      });
    }
  };

app.post(
  "/docker/containers/start",
  docker_container_control(Actions.DOCKER.CONTAINERS.START),
);

app.post(
  "/docker/containers/stop",
  docker_container_control(Actions.DOCKER.CONTAINERS.STOP),
);

app.post(
  "/docker/containers/restart",
  docker_container_control(Actions.DOCKER.CONTAINERS.RESTART),
);

app.listen(port, () => {
  logger.info(`Backend API is running on http://0.0.0.0:${port}`);
});
