import jwt, { SignOptions } from "jsonwebtoken";
import config from "@/config/config";

export default function generateJWT(
  data: object,
  expiresIn: SignOptions["expiresIn"]
) {
  return jwt.sign(data, `${config.JWT_SECRET}`, {
    expiresIn,
  });
}
