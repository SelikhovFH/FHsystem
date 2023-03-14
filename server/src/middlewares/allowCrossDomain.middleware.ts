import { ORIGIN } from "@config";

export const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, ORIGIN);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,PATCH,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type,Authorization`);
  next();
};
