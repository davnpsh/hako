import log, { LogType } from "../utils/log";
import { exec } from "child_process";

interface Container {
  id: string;
  name: string;
  image: string;
  compose_project: string;
}

interface Docker {
  /**
   * Returns a list of containers.
   * @returns {object}
   */
  containers: () => Container[];
}

/**
 * Returns a Docker object with methods to interact with Docker containers.
 * @returns {Docker} Docker object.
 */
export default function (): Docker {
  const obj: Docker = {
    containers: function (): Container[] {
      var containers: Container[] = [];

      const cmd: string = `docker container ls --all --no-trunc --format '{"id": "{{.ID}}", "name": "{{.Names}}", "image": "{{.Image}}", "compose_project": "{{.Label "com.docker.compose.project"}}"}'`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          log(LogType.error, "Couldn't retrieve list of containers:\n", stderr);
          return;
        }

        try {
          containers = stdout
            .trim()
            .split("\n")
            .map((container) => JSON.parse(container));

          log(LogType.info, "Retrieved list of containers.");
          console.log(containers);
        } catch (exception: any) {
          log(LogType.info, "Couldn't retrieve list of containers:", exception);
        }
      });

      return containers;
    },
  };

  return obj;
}
