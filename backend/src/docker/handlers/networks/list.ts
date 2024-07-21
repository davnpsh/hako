import http from "http";
import { Network, Socket } from "../../interfaces/docker";

export default function (socket: Socket): Promise<Network[]> {
  return new Promise((resolve, reject) => {
    const timeout_seconds = 5;
    const options = {
      ...socket.location(),
      path: "/networks",
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
          const networks: Network[] = response.map((network: any) => ({
            id: network.Id,
            name: network.Name,
            scope: network.Scope,
            driver: network.Driver,
          }));

          resolve(networks);
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
