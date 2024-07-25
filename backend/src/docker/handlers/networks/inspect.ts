import axios from "axios";
import { Network, Socket } from "../../interfaces/docker";

export default async function (socket: Socket, id: string): Promise<Network> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: `/networks/${id}`,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  // Parse response to get only useful data
  const network: Network = {
    id: response.data.Id,
    name: response.data.Name,
    scope: response.data.Scope,
    driver: response.data.Driver,
  };

  return network;
}
