// Logging and definitions
import { Actions } from "./definitions/actions";
import { InfoMessage } from "./definitions/info";
import { ErrorMessage } from "./definitions/error";
import logger from "./utils/logger";
import morgan from "morgan";
//
import express, { Request, Response } from "express";
// Docker
import Docker from "./docker";
import { Container, Network } from "./docker/interfaces/docker";

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

/**
 * === DOCKER ===
 */
app.get("/docker/socket", async (req: Request, res: Response) => {
  const info = {
    location: docker.socket.location(),
    running: await docker.socket.isRunning(),
  };

  logger.info(InfoMessage.DOCKER.SOCKET.INFORMATION_LOOKUP);
  res.status(200).json(info);
});

/**
 * = DOCKER CONTAINERS
 */
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
    const container: Container = await docker.containers.inspect(container_id);

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

      await docker.containers.control(container_id, action);
      logger.info(InfoMessage.DOCKER.CONTAINERS.CONTAINER_ACTION + action);
      res.status(200).send();
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

/**
 * = DOCKER NETWORKS
 */
app.get("/docker/networks/list", async (req: Request, res: Response) => {
  try {
    const networks: Network[] = await docker.networks.list();

    logger.info(InfoMessage.DOCKER.NETWORKS.LIST_LOOKUP);
    res.status(200).json(networks);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.LIST_LOOKUP_FAILED, error);
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER.NETWORKS.LIST_LOOKUP_FAILED });
  }
});

app.get("/docker/networks/info/:id", async (req: Request, res: Response) => {
  const network_id: string = req.params.id as string;

  if (!network_id) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.MISSING_ID);
    res.status(400).json({ error: ErrorMessage.DOCKER.NETWORKS.MISSING_ID });
    return;
  }

  try {
    const network: Network = await docker.networks.inspect(network_id);

    logger.info(InfoMessage.DOCKER.NETWORKS.NETWORK_LOOKUP);
    res.status(200).json(network);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.NETWORK_LOOKUP_FAILED, error);
    res
      .status(500)
      .json({ error: ErrorMessage.DOCKER.NETWORKS.NETWORK_LOOKUP_FAILED });
  }
});

app.listen(port, () => {
  logger.info(`Backend API is running on http://0.0.0.0:${port}`);
});
