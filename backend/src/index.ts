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
app.get("/docker/containers", async (req: Request, res: Response) => {
  try {
    const containers: Container[] = await docker.containers.list();

    logger.info(InfoMessage.DOCKER.CONTAINERS.LIST_LOOKUP);
    res.status(200).json(containers);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.CONTAINERS.LIST_LOOKUP_FAILED, error);
    res.status(500).send();
  }
});

app.get("/docker/containers/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id as string;

  if (!id) {
    logger.error(ErrorMessage.DOCKER.CONTAINERS.MISSING_PARAMETERS);
    res.status(400).send();
    return;
  }

  try {
    const container: Container = await docker.containers.inspect(id);

    logger.info(InfoMessage.DOCKER.CONTAINERS.CONTAINER_LOOKUP(id));
    res.status(200).json(container);
  } catch (error) {
    logger.error(
      ErrorMessage.DOCKER.CONTAINERS.CONTAINER_LOOKUP_FAILED(id),
      error,
    );
    res.status(500).send();
  }
});

// Docker containers controls
const docker_container_control =
  (action: string) => async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
      logger.error(ErrorMessage.DOCKER.CONTAINERS.MISSING_PARAMETERS);
      res.status(400).send();
      return;
    }

    try {
      await docker.containers.control(id, action);

      logger.info(InfoMessage.DOCKER.CONTAINERS.CONTAINER_ACTION(id, action));
      res.status(204).send();
    } catch (error) {
      logger.error(
        ErrorMessage.DOCKER.CONTAINERS.CONTAINER_ACTION_FAILED(id, action),
      );
      res.status(500).send();
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
app.get("/docker/networks", async (req: Request, res: Response) => {
  try {
    const networks: Network[] = await docker.networks.list();

    logger.info(InfoMessage.DOCKER.NETWORKS.LIST_LOOKUP);
    res.status(200).json(networks);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.LIST_LOOKUP_FAILED, error);
    res.status(500).send();
  }
});

app.get("/docker/networks/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id as string;

  if (!id) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.MISSING_PARAMETERS);
    res.status(400).send();
    return;
  }

  try {
    const network: Network = await docker.networks.inspect(id);

    logger.info(InfoMessage.DOCKER.NETWORKS.NETWORK_LOOKUP(id));
    res.status(200).json(network);
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.NETWORK_LOOKUP_FAILED(id), error);
    res.status(500).send();
  }
});

app.post("/docker/networks/create", async (req: Request, res: Response) => {
  const { name, driver } = req.body;

  if (!name || !driver) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.MISSING_PARAMETERS);
    res.status(400).send();
    return;
  }

  try {
    const id = await docker.networks.create(name, driver);

    logger.info(InfoMessage.DOCKER.NETWORKS.NETWORK_CREATION(id));
    res.status(201).json({ id: id });
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.NETWORK_CREATION_FAILED);
    res.status(500).send();
  }
});

app.delete("/docker/networks/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id as string;

  if (!id) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.MISSING_PARAMETERS);
    res.status(400).send();
    return;
  }

  try {
    await docker.networks.remove(id);

    logger.info(InfoMessage.DOCKER.NETWORKS.NETWORK_REMOVAL(id));
    res.status(204).send();
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.NETWORK_REMOVAL_FAILED(id));
    res.status(500).send();
  }
});

app.post("/docker/networks/prune", async (req: Request, res: Response) => {
  try {
    await docker.networks.prune();

    logger.info(InfoMessage.DOCKER.NETWORKS.NETWORK_PRUNING);
    res.status(200).send();
  } catch (error) {
    logger.error(ErrorMessage.DOCKER.NETWORKS.NETWORK_PRUNING_FAILED);
    res.status(500).send();
  }
});

app.listen(port, () => {
  logger.info(`Backend API is running on http://0.0.0.0:${port}`);
});
