import http from "http";
import { Container, Socket } from "../../interfaces/docker";
import { Actions } from "../../../definitions/actions";

export default function (
  socket: Socket,
  id: string,
  action: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: `/containers/${id}/${action}`,
      method: "POST",
    };

    const req = http.request(options, (res) => {
      // Response codes based on:
      // https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerStart
      switch (res.statusCode) {
        case 204:
        case 304:
          resolve();
          break;
        default:
          reject();
      }
    });

    req.on("error", (error) => {
      reject(error);
    });

    // Docker direct commands/API can be really slow to report a timeout.
    req.setTimeout(timeout_seconds * 1000, () => {
      let error = new Error("Timeout");
      reject(error);
    });

    req.end();
  });
}
