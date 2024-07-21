import { Networks, Socket } from "../../interfaces/docker";
import list from "./list";
import inspect from "./inspect";
import create from "./create";
import remove from "./remove";
import prune from "./prune";

export default function (socket: Socket): Networks {
  const networks: Networks = {
    list: () => list(socket),
    inspect: (id: string) => inspect(socket, id),
    create: (name: string, driver: string) => create(socket, name, driver),
    remove: (id: string) => remove(socket, id),
    prune: () => prune(socket),
  };

  return networks;
}
