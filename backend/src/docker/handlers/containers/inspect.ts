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

  // Date comes in another format when inspecting individual images.
  // For consistency, convert created date to UNIX timestamp:
  const created_date = new Date(response.data.Created);
  const created_date_unix = Math.floor(
    created_date.getTime() / 1000,
  ).toString();

  const container: Container = {
    id: response.data.Id,
    name: response.data.Name.replace(/^\//, ""),
    image: response.data.Config.Image,
    image_id: response.data.Image.replace(/^sha256:/, ""), // Get clean ID
    created: created_date_unix,
    compose_project: response.data.Config.Labels["com.docker.compose.project"],
  };

  return container;
}
