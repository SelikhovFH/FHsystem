import { config } from "dotenv";

if (process.env.NODE_ENV === "development") {
  config({ path: `.env.development.local` });
}


export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  MONGO_CONNECT_LINK,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET,
  CLIENT_URL,
  AUTH0_MANAGEMENT_SERVICE_DOMAIN
} = process.env;
