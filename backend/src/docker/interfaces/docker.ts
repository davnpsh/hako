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

export interface Image {
  /**
   * Image ID.
   */
  id: string;
  /**
   * Image tags.
   */
  tags: string[];
  /**
   * Image creation date
   */
  created: string;
  /**
   * Image tags.
   */
  size: string;
}

export interface Volume {
  /**
   * The name of the volume.
   */
  name: string;
  /**
   * The driver used by the volume (e.g., 'local', 'nfs', etc.).
   */
  driver: string;
  /**
   * The mount point of the volume on the host system.
   */
  mount_point: string;
  /**
   * The scope of the volume ('local' or 'global').
   */
  scope: string;
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
   * Retrieve information about all Docker networks.
   * @returns {Promise<Network[]>} List of current Docker networks.
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

export interface Images {
  /**
   * Retrieve information about all Docker images.
   * @returns {Promise<Image[]>} List of current Docker images.
   */
  list: () => Promise<Image[]>;
  /**
   * Retrieve information about a single image.
   * @param {string} id - Image ID.
   * @returns {Promise<Network>} Docker image information.
   */
  inspect: (id: string) => Promise<Image>;
  /**
   * Pull a Docker image from a registry.
   * @param {string} name - Image name.
   * @param {string} [tag='latest'] - Image tag.
   */
  pull: (name: string, tag: string) => Promise<void>;
  /**
   * Search for images in the official Docker registry
   * @param {string} term - Search term.
   * @returns {Promise<Network>} Results from Docker registry.
   */
  search: (term: string) => Promise<object[]>;
  /**
   * Delete a Docker image.
   * @param {string} id - Image ID.
   */
  remove: (id: string) => Promise<void>;
  /**
   * Delete unused Docker images.
   */
  prune: () => Promise<void>;
}

export interface Volumes {
  /**
   * Retrieve information about all Docker volumes.
   * @returns {Promise<Volume[]>} List of current Docker volumes.
   */
  list: () => Promise<Volume[]>;
  /**
   * Create a new Docker volume.
   * @param {string} name - Name of the volume to create.
   * @param {string} driver - Volume driver to use.
   */
  create: (name: string, driver: string) => Promise<void>;
  /**
   * Retrieve detailed information about a single Docker volume.
   * @param {string} name - name of the volume to inspect.
   * @returns {Promise<Volume>} Docker volume information.
   */
  inspect: (name: string) => Promise<Volume>;
  /**
   * Remove a Docker volume.
   * @param {string} name - name of the volume to remove.
   * @returns {Promise<void>}
   */
  remove: (name: string) => Promise<void>;
  /**
   * Remove all unused Docker volumes.
   * @returns {Promise<void>}
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
  /**
   * Exposes methods to interact with images.
   */
  images: Images;

  /**
   * Exposes methods to interact with volumes.
   */
  volumes: Volumes;
}
