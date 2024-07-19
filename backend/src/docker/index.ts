import log from "../utils/log";
import { LogType } from "../enums/log";
import { ErrorType } from "../enums/error";
import { Container } from "./interfaces/container";
import { Docker } from "./interfaces/docker";

import { exec } from "child_process";
import http from "http";

/**
 * Returns a Docker object with methods to interact with Docker containers.
 * @returns {Docker} Docker object.
 */
export default function (): Docker {
  const obj: Docker = {
    isRunning: function (): Promise<boolean> {
      return new Promise((resolve) => {
        const docker_host: URL | null = process.env.DOCKER_HOST
          ? new URL(process.env.DOCKER_HOST)
          : null;

        const options = docker_host
          ? // If the socket is an external one, ping using the provided address:
            {
              hostname: docker_host.hostname,
              port: docker_host.port,
              path: "/_ping",
              method: "GET",
            }
          : // If not, ping the local Docker socket:
            {
              socketPath: "/var/run/docker.socket",
              path: "/_ping",
              method: "GET",
            };

        const req = http.request(options, (res) => {
          if (res.statusCode === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        });

        req.on("error", (error) => {
          console.error(ErrorType.DOCKER_SOCKET_NOT_RUNNING, error);
          resolve(false);
        });

        req.end();
      });
    },
    containers: function (): Promise<Container[] | ErrorType> {
      return new Promise((resolve) => {
        const cmd: string = `docker container ls --all --no-trunc --format '{"id": "{{.ID}}", "name": "{{.Names}}", "image": "{{.Image}}", "compose_project": "{{.Label "com.docker.compose.project"}}"}'`;
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            log(LogType.error, ErrorType.CONTAINERS_LOOKUP_FAILED, stderr);
            resolve(ErrorType.CONTAINERS_LOOKUP_FAILED);
            return;
          }

          try {
            let containers: Container[] = stdout
              .trim()
              .split("\n")
              .map((container) => JSON.parse(container));

            log(LogType.info, "Retrieved list of containers.");
            console.log(containers);
            resolve(containers);
          } catch (exception: any) {
            log(LogType.error, ErrorType.CONTAINERS_LOOKUP_FAILED, exception);
            resolve(ErrorType.CONTAINERS_LOOKUP_FAILED);
          }
        });
      });
    },
  };

  return obj;
}
