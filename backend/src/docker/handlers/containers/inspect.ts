import http from "http";
import { Container, Socket } from "../../interfaces/docker";

export default function (socket: Socket, id: string): Promise<Container> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: `/containers/${id}/json`,
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);

          const container: Container = {
            id: response.Id,
            name: response.Name.replace(/^\//, ""),
            image: response.Config.Image,
            compose_project:
              response.Config.Labels["com.docker.compose.project"],
          };

          resolve(container);
        } catch (error) {
          reject(error);
        }
      });
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
