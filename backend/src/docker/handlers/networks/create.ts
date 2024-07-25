import axios from "axios";
import { Socket } from "../../interfaces/docker";

export default async function (
  socket: Socket,
  name: string,
  driver: string,
): Promise<string> {
  const timeout = 5 /* seconds */ * 1000;

  const payload = JSON.stringify({ Name: name, Driver: driver });

  const config = {
    method: "POST",
    url: "/networks/create",
    timeout,
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  const id: string = response.data.Id;

  return id;
}
