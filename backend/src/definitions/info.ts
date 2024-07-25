export const InfoMessage = {
  DOCKER: {
    SOCKET: {
      SOCKET_RUNNING: "Docker socket is running.",
      INFORMATION_LOOKUP: "Retrieved Docker socket information.",
    },
    CONTAINERS: {
      LIST_LOOKUP: "Retrieved Docker containers list.",
      CONTAINER_LOOKUP: (id: string) =>
        `Retrieved information of Docker container ${id}.`,
      CONTAINER_ACTION: (id: string, action: string) =>
        `Success to ${action} Docker container ${id}.`,
    },
    NETWORKS: {
      LIST_LOOKUP: "Retrieved Docker networks list.",
      NETWORK_LOOKUP: (id: string) =>
        `Retrieved information of Docker network ${id}.`,
      NETWORK_CREATION: (id: string) => `Created new Docker network ${id}.`,
      NETWORK_REMOVAL: (id: string) => `Removed Docker network ${id}`,
      NETWORK_PRUNING: "Unused Docker networks pruned.",
    },
  },
};
