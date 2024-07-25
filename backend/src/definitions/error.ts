export const ErrorMessage = {
  DOCKER: {
    SOCKET: {
      NOT_RUNNING: "Docker socket is NOT running or is unreachable.",
    },
    CONTAINERS: {
      MISSING_PARAMETERS: "Missing container parameters.",
      LIST_LOOKUP_FAILED: "Failed to retrieve list of Docker containers.",
      CONTAINER_LOOKUP_FAILED: (id: string) =>
        `Failed to retrieve information of Docker container ${id}.`,
      CONTAINER_ACTION_FAILED: (id: string, action: string) =>
        `Failed to ${action} Docker container ${id}.`,
    },
    NETWORKS: {
      MISSING_PARAMETERS: "Missing network parameters.",
      LIST_LOOKUP_FAILED: "Failed to retrieve list of Docker networks.",
      NETWORK_LOOKUP_FAILED: (id: string) =>
        `Failed to retrieve information of Docker network ${id}.`,
      NETWORK_CREATION_FAILED: "Failed to create a new Docker Network.",
      NETWORK_REMOVAL_FAILED: (id: string) =>
        `Failed to remove Docker network ${id}`,
      NETWORK_PRUNING_FAILED: "Failed to remove unused Docker networks.",
    },
  },
};
