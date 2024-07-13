import express, { Request, Response } from "express";

const app = express();
const host = "127.0.0.1";
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
