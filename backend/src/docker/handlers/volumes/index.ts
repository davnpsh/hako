import { Socket, Volumes } from "../../interfaces/docker";

import list from "./list";
import inspect from "../volumes/inspect";
import create from "./create";
import remove from "./remove";
import prune from "./prune";

export default function (socket: Socket): Volumes {
  const volumes: Volumes = {
    list: () => list(socket),
    create: (name: string, driver: string) => create(socket, name, driver),
    inspect: (name: string) => inspect(socket, name),
    remove: (name: string) => remove(socket, name),
    prune: () => prune(socket),
  };

  return volumes;
}
