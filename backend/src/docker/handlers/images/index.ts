import { Images, Socket } from "../../interfaces/docker";
import list from "./list";
import inspect from "./inspect";
import pull from "./pull";
import search from "./search";
import remove from "./remove";
import prune from "./prune";

export default function (socket: Socket): Images {
  const images: Images = {
    list: () => list(socket),
    inspect: (id: string) => inspect(socket, id),
    pull: (name: string, tag: string) => pull(socket, name, tag),
    search: (term: string) => search(socket, term),
    remove: (id: string) => remove(socket, id),
    prune: () => prune(socket),
  };

  return images;
}
