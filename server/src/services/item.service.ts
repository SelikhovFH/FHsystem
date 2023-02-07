import itemModel from "@models/item.model";
import { CreateItemDto, UpdateItemDto } from "@dtos/item.dto";
import { Item } from "@interfaces/item.interface";

class ItemService {
  private item = itemModel;

  public async createItem(data: CreateItemDto): Promise<Item> {
    return this.item.create(data);
  }

  public async updateItem(_id: string, data: Partial<UpdateItemDto>): Promise<Item> {
    return this.item.findOneAndUpdate({ _id }, data);
  }

  public async deleteItem(_id: string) {
    return this.item.findOneAndDelete({ _id });
  }

  public async getItemById(_id: string) {
    return this.item.findOne({ _id });
  }

  public async getItems(): Promise<Item[]> {
    return this.item.find();
  }
}

export default ItemService;
