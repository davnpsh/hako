import http from "http";
import { Container, Socket } from "../../interfaces/docker";

export default function (
  socket: Socket,
  container_id: string,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: `/containers/${container_id}/start`,
      method: "POST",
    };

    const req = http.request(options, (res) => {
      // Return response code and handle it on function call
      resolve(res.statusCode as number);
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
