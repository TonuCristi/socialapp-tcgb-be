import config from "@/config/config";
import { Request } from "express";
import jwt from "jsonwebtoken";

export function verifyJWT(req: Request) {
  const token = req.headers.authorization?.split(" ")[1];

  const decoded = jwt.verify(token as string, config.JWT_SECRET as string);

  if (!(decoded && typeof decoded !== "string")) {
    throw new Error("Invalid JWT!");
  }

  return decoded;
}
