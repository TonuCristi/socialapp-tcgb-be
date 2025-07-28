import { Request, Response } from "express";

async function getPosts(req: Request, res: Response) {
  try {
    res.status(200).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      console.log("Error message:", error.message);
    } else {
      console.log("An unknown error occurred:", error);
    }
  }
}

export default getPosts;
