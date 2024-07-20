import { Containers, Socket } from "../../interfaces/docker";
import list from "./list";
import info from "./info";
import start from "./start";

export default function (socket: Socket): Containers {
  const containers: Containers = {
    list: () => list(socket),
    info: (container_id: string) => info(socket, container_id),
    start: (container_id: string) => start(socket, container_id),
  };

  return containers;
}
