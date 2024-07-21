export const ErrorMessage = {
  DOCKER: {
    SOCKET: {
      NOT_RUNNING: "Docker socket is NOT running or is unreachable.",
    },
    CONTAINERS: {
      MISSING_PARAMETERS: "Missing container parameters.",
      LIST_LOOKUP_FAILED:
        "An error ocurred while trying to fetch the list of containers.",
      CONTAINER_LOOKUP_FAILED:
        "An error ocurred while trying to fetch the container information.",
      CONTAINER_INVALID_ACTION: "Docker container invalid action.",
      CONTAINER_ACTION_FAILED: "Docker container action failed: ",
    },
    NETWORKS: {
      MISSING_PARAMETERS: "Missing network parameters.",
      LIST_LOOKUP_FAILED:
        "An error ocurred while trying to fetch the list of networks.",
      NETWORK_LOOKUP_FAILED:
        "An error ocurred while trying to fetch the network information.",
      NETWORK_CREATION_FAILED:
        "An error ocurred while trying to create the network.",
      NETWORK_REMOVAL_FAILED:
        "An error ocurred while trying to remove the network.",
      NETWORK_PRUNING_FAILED:
        "An error ocurred while trying to remove unused networks.",
    },
  },
};
