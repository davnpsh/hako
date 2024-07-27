import axios from "axios";
import { Image, Socket } from "../../interfaces/docker";

export default async function (
  socket: Socket,
  term: string,
): Promise<object[]> {
  const timeout = 5 /* seconds */ * 1000;

  const query = { term: term };

  const config = {
    method: "GET",
    url: "/images/search",
    params: query,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  const response = await axios(config);

  return response.data;
}
