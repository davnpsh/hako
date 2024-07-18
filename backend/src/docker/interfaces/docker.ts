import { Container } from "./container";
import { ErrorType } from "../../enums/error";

export interface Docker {
  /**
   * Socket path.
   */
  socketPath: string;
  /**
   * Returns a list of containers.
   * @returns {object}
   */
  containers: () => Promise<Container[] | ErrorType>;
  /**
   * Check if docker socket is running.
   * @returns {boolean}
   */
  isRunning: () => Promise<boolean>;
}
