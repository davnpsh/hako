import { LogType } from "../enums/log";

/**
 * Logs a message through the server console.
 * @param {LogType} type - Type of the message.
 * @param {string} message - Main message to display.
 * @param {string[]} opt_msgs - Optional arguments to display along the main message.
 */
export default function (
  type: LogType,
  message: string,
  ...opt_msgs: string[]
) {
  if (opt_msgs.length > 0) {
    message += " " + opt_msgs.join(" ");
  }

  switch (type) {
    case LogType.error:
      console.error(`[ backend ][ ${LogType.error} ] ${message}`);
      break;
    case LogType.info:
      console.log(`[ backend ][ ${LogType.info} ] ${message}`);
      break;
  }
}
