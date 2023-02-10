import { Document, model, Schema } from "mongoose";
import { Item, ItemSize } from "@interfaces/item.interface";

const itemSchema: Schema = new Schema({
  name: String,
  description: String,
  quantity: Number,
  size: {
    type: String,
    enum: Object.values(ItemSize)
  }
});
const itemModel = model<Item & Document>('Item', itemSchema);

export default itemModel;
