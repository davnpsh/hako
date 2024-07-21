import { Docker, Container } from "./interfaces/docker";
// API handlers
import socket from "./handlers/socket";
import containers from "./handlers/containers";
import networks from "./handlers/networks";

/**
 * Returns a Docker object with methods to interact with Docker.
 * @returns { Docker } Docker object.
 */
export default function (): Docker {
  const docker: Docker = {
    socket: socket,
    containers: containers(socket),
    networks: networks(socket),
  };

  return docker;
}
