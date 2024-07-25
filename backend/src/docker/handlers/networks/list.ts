import axios from "axios";
import { Network, Socket } from "../../interfaces/docker";

export default async function (socket: Socket): Promise<Network[]> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: "/networks",
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  // Parse response to get only useful data
  const networks: Network[] = response.data.map((network: any) => ({
    id: network.Id,
    name: network.Name,
    scope: network.Scope,
    driver: network.Driver,
  }));

  return networks;
}
