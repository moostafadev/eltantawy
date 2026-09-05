export interface CheckoutDeliveryZoneOption {
  id: string;
  title: string;
  cost: number;
}

export interface IProps {
  zones: CheckoutDeliveryZoneOption[];
}
