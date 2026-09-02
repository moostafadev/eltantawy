export interface DeliveryZoneParent {
  id: string;
  title: string;
  parentId: string | null;
  cost: number | null;
  isActive: boolean;
  _count: {
    children: number;
  };
}

export interface IBaseProps {
  zones: DeliveryZoneParent[];
}

export interface IGraphProps extends IBaseProps {
  selectedId?: string;
}

export interface INodeProps extends IBaseProps {
  zone: DeliveryZoneParent;
  isRoot?: boolean;
}
