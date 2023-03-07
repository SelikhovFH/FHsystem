import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import { DeleteDto } from "@dtos/common.dto";
import ClientController from "@controllers/client.controller";
import { CreateClientDto, UpdateClientDto } from "@dtos/client.dto";

class ClientsRoute implements Routes {
  public path = "/clients";
  public router = Router();
  public clientController = new ClientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isEditorMiddleware, this.clientController.getClients);
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateClientDto, "body"), this.clientController.createClient);
    this.router.delete(`${this.path}/:id`, isEditorMiddleware, validationMiddleware(DeleteDto, "params"), this.clientController.deleteClient);
    this.router.patch(`${this.path}`, isEditorMiddleware, validationMiddleware(UpdateClientDto, "body"), this.clientController.updateClient);
  }
}

export default ClientsRoute;
