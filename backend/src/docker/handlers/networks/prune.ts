import http from "http";
import { Socket } from "../../interfaces/docker";

export default function (socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: "/networks/prune",
      method: "POST",
    };

    const req = http.request(options, (res) => {
      res.statusCode === 200 ? resolve() : reject();
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
