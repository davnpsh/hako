import axios from "axios";

import { Socket, Volume } from "../../interfaces/docker";

export default async function (
  socket: Socket,
  name: string,
  driver: string,
): Promise<void> {
  const timeout = 5 /* seconds */ * 1000;

  const payload = JSON.stringify({
    Name: name,
    Driver: driver,
  });

  const config = {
    method: "POST",
    url: "/volumes/create",
    timeout,
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  await axios(config);

  return;
}
