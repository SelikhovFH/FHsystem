import { Item } from "../../shared/item.interface";

export const renderItemName = (item: Item, withQuantity?: boolean) => {
  if (withQuantity) {
    return `${item.name} ${item.size || ""} (${item.quantity})`;
  }
  return `${item.name} ${item.size || ""}`;
};
