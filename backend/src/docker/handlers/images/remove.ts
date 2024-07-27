import axios from "axios";
import { Image, Socket } from "../../interfaces/docker";

export default async function (socket: Socket, id: string): Promise<void> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "DELETE",
    url: `/images/${id}`,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  await axios(config);

  return;
}