import { Containers, Socket } from "../../interfaces/docker";
import list from "./list";
import info from "./info";
import control from "./control";

export default function (socket: Socket): Containers {
  const containers: Containers = {
    list: () => list(socket),
    info: (container_id: string) => info(socket, container_id),
    control: (container_id: string, action: string) =>
      control(socket, container_id, action),
  };

  return containers;
}
