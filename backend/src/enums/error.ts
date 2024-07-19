export enum ErrorMessage {
  DOCKER_SOCKET_NOT_RUNNING = "Docker socket is NOT running or is unreachable.",
  DOCKER_CONTAINERS_LOOKUP_FAILED = "An error ocurred while trying to fetch the list of containers.",
  DOCKER_CONTAINER_LOOKUP_FAILED = "An error ocurred while trying to fetch the container information.",
  MISSING_CONTAINER_ID = "Missing container ID.",
}
