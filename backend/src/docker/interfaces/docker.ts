export interface Container {
  /**
   * Container ID.
   */
  id: string;
  /**
   * Container name.
   */
  name: string;
  /**
   * Container image used.
   */
  image: string;
  /**
   * Container compose project group.
   */
  compose_project?: string;
}

export interface Socket {
  /**
   * Returns the calculated location of the Docker socket.
   * @returns {object}
   */
  location: () => object;
  /**
   * Check if docker socket is running.
   * @returns {Promise<boolean>}
   */
  isRunning: () => Promise<boolean>;
}

export interface Containers {
  /**
   * Returns a list of current Docker containers.
   * @returns {Promise<Container[]>}
   */
  list: () => Promise<Container[]>;
  /**
   * Returns information about a single container.
   * @param {string} container_id - Container's complete ID.
   * @returns {Promise<Container>}
   */
  info: (container_id: string) => Promise<Container>;
}

export interface Docker {
  /**
   * Contains Docker socket information.
   */
  socket: Socket;
  /**
   * Exposes methods to interact with containers.
   */
  containers: Containers;
}
