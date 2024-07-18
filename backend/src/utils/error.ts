import { ErrorType } from "../enums/error";
import { Response } from "express";

/**
 * Sends an error response to the client with a specific status code and message.
 * @param {Response} res - Express Response object to send the response to client.
 * @param {number} statusCode - HTTP status code to send.
 * @param {string} type - Error type with brief description of the error for the client.
 */
export function sendError(res: Response, statusCode: number, type: ErrorType) {
  res.status(statusCode).json({ error: type.toString() });
}
