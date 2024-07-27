import { Socket, Volumes } from "../../interfaces/docker";

import list from "./list";
import inspect from "../volumes/inspect";
import create from "./create";
import remove from "./remove";
import prune from "./prune";

export default function (socket: Socket): Volumes {
  const volumes: Volumes = {
    list: () => list(socket),
    create: (
      name: string,
      driver: string,
      driverOpts?: Record<string, string>,
      labels?: Record<string, string>,
      ClusterVolumeSpec?: Record<string, string>,
    ) => create(socket, name, driver, driverOpts, labels, ClusterVolumeSpec),
    inspect: (name: string) => inspect(socket, name),
    remove: (name: string) => remove(socket, name),
    prune: () => prune(socket),
  };

  return volumes;
}
