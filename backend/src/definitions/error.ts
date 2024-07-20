export const ErrorMessage = {
  DOCKER: {
    SOCKET: {
      NOT_RUNNING: "Docker socket is NOT running or is unreachable.",
    },
    CONTAINERS: {
      MISSING_ID: "Missing container ID.",
      LIST_LOOKUP_FAILED:
        "An error ocurred while trying to fetch the list of containers.",
      CONTAINER_LOOKUP_FAILED:
        "An error ocurred while trying to fetch the container information.",
      CONTAINER_INVALID_ACTION: "Docker container invalid action.",
      CONTAINER_ACTION_FAILED: "Docker container action failed: ",
    },
  },
};
