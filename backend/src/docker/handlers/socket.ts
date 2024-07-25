import axios from "axios";
import { Socket } from "../interfaces/docker";

const socket: Socket = {
  location: function (): object {
    const docker_host: URL | null = process.env.DOCKER_HOST
      ? new URL(process.env.DOCKER_HOST)
      : null;

    const location = docker_host
      ? // If the socket is an external one, use the provided address:
        {
          baseURL: `http://${docker_host.hostname}:${docker_host.port}`,
        }
      : // If not, use the mounted Docker socket:
        {
          socketPath: "/var/run/docker.sock",
        };

    return location;
  },
  isRunning: async function (): Promise<boolean> {
    const timeout = 5 /* seconds */ * 1000;

    const config = {
      method: "GET",
      url: "/_ping",
      timeout,
      ...this.location(),
    };

    // Return true of false depending on responde code status
    return axios(config).then((response) => response.status === 200);
  },
};

export default socket;
