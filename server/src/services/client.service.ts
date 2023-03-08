import clientModel from "@models/client.model";
import { CreateClientDto, UpdateClientDto } from "@dtos/client.dto";

class ClientService {
  private client = clientModel;

  public async createClient(data: CreateClientDto) {
    return this.client.create(data);
  }

  public async updateClient(_id: string, data: Partial<UpdateClientDto>) {
    return this.client.findOneAndUpdate({ _id }, data);
  }

  public async deleteClient(_id: string) {
    return this.client.findOneAndDelete({ _id });
  }

  public async getClientById(_id: string) {
    return this.client.findOne({ _id });
  }

  public async getClients() {
    return this.client.find();
  }
}

export default ClientService;
