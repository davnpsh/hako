import { exec } from "child_process";

interface Docker {
  listContainers: () => object;
}

export default function (): Docker {
  const obj: Docker = {
    /*
     * Returns list of containers.
     */
    listContainers: function () {
      // Get current containers list
      const cmd = 'docker ps -a --no-trunc --format="{{json .}}"';
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.log("An error ocurred:\n", stderr);
          return;
        }

        const lines = stdout.split("\n");

        const containers = lines
          .filter((line) => line.trim() !== "") // Remove empty objects
          .map((line) => JSON.parse(line));
        console.log(containers);
      });
      return {};
    },
  };

  return obj;
}
