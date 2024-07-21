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

export interface Network {
  /**
   * Network ID.
   */
  id: string;
  /**
   * Network name.
   */
  name: string;
  /**
   * Network scope.
   */
  scope: string;
  /**
   * Network driver.
   */
  driver: string;
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
   * Retrieve information about all Docket containers.
   * @returns {Promise<Container[]>} List of current Docker containers.
   */
  list: () => Promise<Container[]>;
  /**
   * Retrieve information about a single container.
   * @param {string} id - Container ID.
   * @returns {Promise<Container>} Docker container information.
   */
  inspect: (id: string) => Promise<Container>;
  /**
   * Start, stop or restart a Docker container.
   * @param {string} id - Container ID.
   * @param {string} action - Container action to execute (start, stop or restart).
   */
  control: (id: string, action: string) => Promise<void>;
}

export interface Networks {
  /**
   * Retrieve information about all Docket networks.
   * @returns {Promise<Container[]>} List of current Docker networks.
   */
  list: () => Promise<Network[]>;
  /**
   * Retrieve information about a single network.
   * @param {string} id - Network ID.
   * @returns {Promise<Network>} Docker network information.
   */
  inspect: (id: string) => Promise<Network>;
  /**
   * Create a new Docker network.
   * @param {string} name - Network name.
   * @param {string} driver - Network driver.
   * @returns {Promise<string>} Network ID.
   */
  create: (name: string, driver: string) => Promise<string>;
  /**
   * Delete a Docker network.
   * @param {string} id - Network ID.
   */
  remove: (id: string) => Promise<void>;
  /**
   * Delete unused Docker networks.
   */
  prune: () => Promise<void>;
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
  /**
   * Exposes methods to interact with networks.
   */
  networks: Networks;
}
