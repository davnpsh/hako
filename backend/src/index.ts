import log from "./utils/log";
import { LogType } from "./enums/log";
import { ErrorMessage } from "./enums/error";
import express, { Request, Response } from "express";
import Docker from "./docker";
import { Container } from "./docker/interfaces/container";

const app = express();
const port = 3000;

// APIs
const docker = Docker();

app.get("/docker/containers", async (req: Request, res: Response) => {
  try {
    let containers: Container[] = await docker.containers();
    res.status(200).json(containers);
  } catch (error) {
    log(
      LogType.error,
      ErrorMessage.CONTAINERS_LOOKUP_FAILED,
      (error as Error).message,
    );
    res.status(500).json({ error: ErrorMessage.CONTAINERS_LOOKUP_FAILED });
  }
});

app.listen(port, () => {
  log(LogType.info, `Backend API is running on http://0.0.0.0:${port}`);
});
