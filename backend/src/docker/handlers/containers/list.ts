import http from "http";
import { Container, Socket } from "../../interfaces/docker";

export default function (socket: Socket): Promise<Container[]> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: "/containers/json?all=true",
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

          // We just need essential data
          const containers: Container[] = response.map((container: any) => ({
            id: container.Id,
            name: container.Names[0].replace(/^\//, ""),
            image: container.Image,
            compose_project: container.Labels["com.docker.compose.project"],
          }));

          resolve(containers);
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
