import axios from "axios";
import { Container, Socket } from "../../interfaces/docker";

export default async function (socket: Socket): Promise<Container[]> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: "/containers/json?all=true",
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  // Parse response to get only useful data
  const containers: Container[] = response.data.map((container: any) => ({
    id: container.Id,
    name: container.Names[0].replace(/^\//, ""),
    image: container.Image,
    compose_project: container.Labels["com.docker.compose.project"],
  }));

  return containers;
}
