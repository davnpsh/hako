import http from "http";
import { Socket } from "../interfaces/docker";

const socket: Socket = {
  location: function (): object {
    const docker_host: URL | null = process.env.DOCKER_HOST
      ? new URL(process.env.DOCKER_HOST)
      : null;

    const location = docker_host
      ? // If the socket is an external one, use the provided address:
        {
          hostname: docker_host.hostname,
          port: docker_host.port,
        }
      : // If not, use the mounted Docker socket:
        {
          socketPath: "/var/run/docker.sock",
        };

    return location;
  },
  isRunning: function (): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout_seconds = 5;
      const options = { ...this.location(), path: "/_ping", method: "GET" };

      const req = http.request(options, (res) => {
        // Docker socket was found and running
        resolve(res.statusCode === 200);
      });

      req.on("error", (err) => {
        // Docker socket not running or not found
        resolve(false);
      });

      // Docker direct commands/API can be really slow to report a timeout.
      req.setTimeout(timeout_seconds * 1000, () => {
        resolve(false);
      });

      req.end();
    });
  },
};

export default socket;
