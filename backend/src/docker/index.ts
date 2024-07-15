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
      exec("docker ps -a", (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
      });
      return {};
    },
  };

  return obj;
}
