import axios from "axios";
import { Container, Socket } from "../../interfaces/docker";

export default async function (socket: Socket, id: string): Promise<Container> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: `/containers/${id}/json`,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  const container: Container = {
    id: response.data.Id,
    name: response.data.Name.replace(/^\//, ""),
    image: response.data.Config.Image,
    compose_project: response.data.Config.Labels["com.docker.compose.project"],
  };

  return container;
}
