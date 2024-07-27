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

  const image: Image = {
    id: response.data.Id,
    tags: response.data.RepoTags,
  };

  return image;
}
