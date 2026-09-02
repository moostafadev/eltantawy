export type DeliveryZone = {
  id: string;
  title: string;
  cost: number | null;
  isActive: boolean;

  parent: {
    id: string;
    title: string;
  } | null;

  _count: {
    children: number;
  };

  createdAt: Date;
};

export interface IProps {
  deliveryZones: DeliveryZone[];
}
