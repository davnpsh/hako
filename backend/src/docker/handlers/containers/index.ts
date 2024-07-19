import { Containers, Socket } from "../../interfaces/docker";
import list from "./list";

export default function (socket: Socket): Containers {
  const containers: Containers = {
    list: () => list(socket),
  };

  return containers;
}
