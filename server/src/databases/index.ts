import { MONGO_CONNECT_LINK } from "@config";

export const dbConnection = {
  url: MONGO_CONNECT_LINK,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};
