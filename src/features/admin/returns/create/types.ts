export interface ReturnableItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  returnedQty: number;
  unit: "KG" | "PIECE";
}

export interface Props {
  orderId: string;
  items: ReturnableItem[];
}
