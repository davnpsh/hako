import axios from "axios";

import { Socket, Volume } from "../../interfaces/docker";

export default async function (
  socket: Socket,
  name: string,
  driver: string,
  driverOpts?: Record<string, string>,
  labels?: Record<string, string>,
  ClusterVolumeSpec?: Record<string, string>,
): Promise<string> {
  const timeout = 5 /* seconds */ * 1000;

  const payload = JSON.stringify({
    Name: name,
    Driver: driver,
    DriverOpts: driverOpts,
    Labels: labels,
    ClusterVolumeSpec: ClusterVolumeSpec,
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

  const response = await axios(config);

  // Parse response to get only useful data
  const id: string = response.data.Name;

  return id;
}
