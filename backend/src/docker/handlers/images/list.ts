import axios from "axios";
import { Image, Socket } from "../../interfaces/docker";

export default async function (socket: Socket): Promise<Image[]> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "GET",
    url: "/images/json",
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  // Parse response to get only useful data
  const images: Image[] = response.data.map((image: any) => ({
    id: image.Id,
    tags: image.RepoTags,
    created: image.Created, // This is on UNIX timestamp by default
  }));

  return images;
}
