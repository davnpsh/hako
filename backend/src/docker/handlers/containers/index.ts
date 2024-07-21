import { Containers, Socket } from "../../interfaces/docker";
import list from "./list";
import inspect from "./inspect";
import control from "./control";

export default function (socket: Socket): Containers {
  const containers: Containers = {
    list: () => list(socket),
    inspect: (id: string) => inspect(socket, id),
    control: (id: string, action: string) => control(socket, id, action),
  };

  return containers;
}
