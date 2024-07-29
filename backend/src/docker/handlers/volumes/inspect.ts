import axios from "axios";

import { Socket, Volume } from "../../interfaces/docker";

export default async function (socket: Socket, name: string): Promise<Volume> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: `/volumes/${name}`,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  // Parse response to get only useful data
  const volume: Volume = {
    name: response.data.Name,
    driver: response.data.Driver,
    mount_point: response.data.Mountpoint,
    scope: response.data.Scope,
  };

  return volume;
}
