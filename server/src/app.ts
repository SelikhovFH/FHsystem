import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import hpp from "hpp";
import morgan from "morgan";
import { connect, set } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { LOG_FORMAT, NODE_ENV, PORT } from "@config";
import { dbConnection } from "@databases";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import dayjsBusinessDays from "dayjs-business-days";
import minMax from "dayjs/plugin/minMax";
import helmet from "helmet";
import { authMiddleware } from "@middlewares/auth.middleware";
import cors from "cors";

dayjs.extend(isBetween);
dayjs.extend(dayjsBusinessDays);
dayjs.extend(minMax);

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

    this.initializeSwagger();
    this.initializeCertChallenge();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", true);
    }

    //@ts-ignore
    connect(dbConnection.url, dbConnection.options);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    if (this.env === "development") {
      this.app.use(cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"],
        allowedHeaders: [
          "Origin", "Accept", "X-Requested-With", "X-Forwarded-For",
          "X-Forwarded-Proto", "X-Real-IP", "Host", "Content-Type", "Authorization"
        ]
      }));
    }
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(authMiddleware);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeCertChallenge() {
    // this.app.use("/.well-known/acme-challenge/WViavPd5oVzAFFg8749gzb6pzI5uZ-DAIjNMSmFhpTM", (req, res) => {
    //   return res.status(200).send("WViavPd5oVzAFFg8749gzb6pzI5uZ-DAIjNMSmFhpTM.TY-sdxBgzkm-s_HcB-gGJYbxv1ApqdvMTeVydFg7820");
    // });
    // this.app.use("/.well-known/acme-challenge/Tm15zfum8cX05kdUTxIZA2j_ezNhBmkcmn2Qcl6-Qbc", (req, res) => {
    //   return res.status(200).send("Tm15zfum8cX05kdUTxIZA2j_ezNhBmkcmn2Qcl6-Qbc.TY-sdxBgzkm-s_HcB-gGJYbxv1ApqdvMTeVydFg7820");
    // });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description: "Example docs"
        }
      },
      apis: ["swagger.yaml"]
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
