import axios from "axios";
import { Container, Socket } from "../../interfaces/docker";
import { Actions } from "../../../definitions/actions";

export default async function (
  socket: Socket,
  id: string,
  action: string,
): Promise<void> {
  const timeout = 5 /* seconds */ * 1000;

  const config = {
    method: "POST",
    url: `/containers/${id}/${action}`,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...socket.location(),
  };

  await axios(config).catch((error) => {
    // Make exception on 304, since there is no modification
    // https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerStart
    if (error.response.status !== 304) throw new Error();
  });

  return;
}
