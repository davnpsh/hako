import { Docker, Container } from "./interfaces/docker";
// API handlers
import socket from "./handlers/socket";
import containers from "./handlers/containers";

/**
 * Returns a Docker object with methods to interact with Docker.
 * @returns { Docker } Docker object.
 */
export default function (): Docker {
  const docker: Docker = {
    socket: socket,
    containers: containers(socket),
  };

  return docker;
}
