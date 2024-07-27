import axios from "axios";
import { Image, Socket } from "../../interfaces/docker";

export default async function (
  socket: Socket,
  name: string,
  tag: string,
): Promise<void> {
  const timeout = 5 /* seconds */ * 1000;

  const query = { fromImage: name, tag: tag || "latest" };

  const config = {
    method: "POST",
    url: "/images/create",
    params: query,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  await axios(config);

  return;
}
