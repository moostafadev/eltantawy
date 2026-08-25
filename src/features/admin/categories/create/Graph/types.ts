export interface CategoryParent {
  id: string;
  title: string;
  parentId: string | null;
}

interface IBaseProps {
  categories: CategoryParent[];
  selectedId?: string;
}

interface INodeProps {
  category: CategoryParent;
  categories: CategoryParent[];
  isRoot?: boolean;
}

interface IProps {
  categories: CategoryParent[];
}

export type { IProps, IBaseProps, INodeProps };
