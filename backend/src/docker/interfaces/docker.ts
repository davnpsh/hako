import { Container } from "./container";

export interface Docker {
  /**
   * Returns a list of containers.
   * @returns {object}
   */
  containers: () => Promise<Container[]>;
  /**
   * Check if docker socket is running.
   * @returns {boolean}
   */
  isRunning: () => Promise<boolean>;
}
