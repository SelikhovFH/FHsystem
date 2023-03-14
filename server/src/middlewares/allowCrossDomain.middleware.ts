import { ORIGIN } from "@config";

export const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, ORIGIN);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,PATCH,DELETE,OPTIONS`);
  res.header(`Access-Control-Allow-Headers`, `Origin,Accept,X-Requested-With,X-Forwarded-For,X-Forwarded-Proto,X-Real-IP,Host,Content-Type,Authorization`);
  next();
};