import axios from "axios";
import { Image, Socket } from "../../interfaces/docker";

export default async function (socket: Socket, id: string): Promise<Image> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: `/images/${id}/json`,
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
  const unix_timestamp = Math.floor(created_date.getTime() / 1000).toString();

  const image: Image = {
    id: response.data.Id.replace(/^sha256:/, ""), // Get clean ID
    tags: response.data.RepoTags,
    created: unix_timestamp,
    size: response.data.Size,
  };

  return image;
}
