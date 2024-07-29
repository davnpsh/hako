import axios from "axios";

import { Volume, Socket } from "../../interfaces/docker";

export default async function (socket: Socket): Promise<Volume[]> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: "/volumes",
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  // Parse response to get only useful data
  const volumes: Volume[] = response.data.Volumes.map((volume: any) => ({
    name: volume.Name,
    driver: volume.Driver,
    mount_point: volume.Mountpoint,
    scope: volume.Scope,
  }));

  return volumes;
}
