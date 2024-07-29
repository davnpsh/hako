import axios from "axios";

import { Socket } from "../../interfaces/docker";

export default async function (socket: Socket, name: string): Promise<void> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "DELETE",
    url: `/volumes/${name}`,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  await axios(config);

  return;
}
