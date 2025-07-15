import { verifyJWT } from "@/utils/verifyJWT";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: "Access denied!" });
  }

  if (!auth.split(" ")[1]) {
    return res.status(401).json({ message: "Access denied!" });
  }

  try {
    verifyJWT(req);

    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: "Inavlid token!" });
      console.log("Error message:", error.message);
    } else {
      console.log("An unknown error occurred:", error);
    }
  }
}
