import { NextFunction, Request, Response } from "express";
import ClientService from "@services/client.service";
import { CreateClientDto, UpdateClientDto } from "@dtos/client.dto";

class ClientController {
  private clientService = new ClientService();

  createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientData: CreateClientDto = req.body;
      const data = await this.clientService.createClient(clientData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientData: UpdateClientDto = req.body;
      const data = await this.clientService.updateClient(clientData._id, clientData);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.clientService.deleteClient(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.clientService.getClients();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default ClientController;
