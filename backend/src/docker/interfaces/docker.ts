import { Container } from "./container";

export interface Socket {
  /**
   * Returns the calculated location of the Docker socket.
   * @returns {object}
   */
  location: () => object;
  /**
   * Check if docker socket is running.
   * @returns {boolean}
   */
  isRunning: () => Promise<boolean>;
}

export interface Docker {
  /**
   * Contains Docker socket information.
   */
  socket: Socket;
  /**
   * Returns a list of containers.
   * @returns {Container[]}
   */
  containers: () => Promise<Container[]>;
}
