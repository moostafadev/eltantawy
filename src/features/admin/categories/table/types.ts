export type Category = {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;

  parent: {
    id: string;
    title: string;
  } | null;

  _count: {
    products: number;
    children: number;
  };

  createdAt: Date;
};

export interface IProps {
  categories: Category[];
}
