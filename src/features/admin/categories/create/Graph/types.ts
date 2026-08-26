export interface CategoryParent {
  id: string;
  title: string;
  parentId: string | null;
}

export interface IBaseProps {
  categories: CategoryParent[];
}

export interface IGraphProps extends IBaseProps {
  selectedId?: string;
}

export interface INodeProps extends IBaseProps {
  category: CategoryParent;
  isRoot?: boolean;
}
