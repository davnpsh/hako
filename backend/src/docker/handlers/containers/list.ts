import { Container } from "../../interfaces/docker";
import { exec } from "child_process";

export default function (): Promise<Container[]> {
  return new Promise((resolve, reject) => {
    const cmd: string = `docker container ls --all --no-trunc --format '{"id": "{{.ID}}", "name": "{{.Names}}", "image": "{{.Image}}", "compose_project": "{{.Label "com.docker.compose.project"}}"}'`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      let containers: Container[] = stdout
        .trim()
        .split("\n")
        .map((container) => JSON.parse(container));

      resolve(containers);
    });
  });
}
