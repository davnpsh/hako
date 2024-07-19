import http from "http";
import { Container, Socket } from "../../interfaces/docker";

export default function (
  socket: Socket,
  container_id: string,
): Promise<Container> {
  return new Promise((resolve, reject) => {
    // TODO: Retrieve container's information
  });
}
