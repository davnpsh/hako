import http from "http";
import { Socket } from "../../interfaces/docker";

export default function (
  socket: Socket,
  name: string,
  driver: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: "/networks/create",
      method: "POST",
    };
    const payload = JSON.stringify({ Name: name, Driver: driver });

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          const id: string = response.Id;
          resolve(id);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(payload);

    // Docker direct commands/API can be really slow to report a timeout.
    req.setTimeout(timeout_seconds * 1000, () => {
      let error = new Error("Timeout");
      reject(error);
    });

    req.end();
  });
}
