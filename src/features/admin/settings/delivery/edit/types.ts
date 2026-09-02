export interface DeliveryZone {
  id: string;
  title: string;
  cost: number | null;
  isActive: boolean;
  parentId: string | null;
}

export interface DeliveryZoneOption {
  id: string;
  title: string;
  parentId: string | null;
  cost: number | null;
  isActive: boolean;
  _count: {
    children: number;
  };
}

export interface IProps {
  zone: DeliveryZone;
  zones: DeliveryZoneOption[];
}
