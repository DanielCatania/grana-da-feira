import jwt from "jsonwebtoken";

const KEY = process.env.JWT_SECRET;
if (!KEY) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtUtils = {
  sign: (payload: object, options: jwt.SignOptions) =>
    jwt.sign(payload, KEY, {
      algorithm: "HS256",
      ...options,
    }),
  verify: (token: string) => {
    try {
      return jwt.verify(token, KEY) as object;
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("JWT verification error:", error);
      return null;
    }
  },
  decode: (token: string) => {
    try {
      return jwt.decode(token) as object | null;
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("JWT decode error:", error);
      return null;
    }
  },
};

export default jwtUtils;
