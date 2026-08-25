import { CategoryParent } from "./types";

export interface CategoryOption {
  value: string;
  label: string;
}

export const buildCategoryOptions = (
  categories: CategoryParent[],
): CategoryOption[] => {
  const options: CategoryOption[] = [
    {
      value: "",
      label: "تصنيف رئيسي",
    },
  ];

  const build = (parentId: string | null, parentPath: string[]) => {
    const children = categories
      .filter((category) => category.parentId === parentId)
      .sort((a, b) => a.title.localeCompare(b.title, "ar"));

    for (const category of children) {
      const currentPath = [...parentPath, category.title];

      options.push({
        value: category.id,
        label: currentPath.join(" > "),
      });

      build(category.id, currentPath);
    }
  };

  build(null, []);

  return options;
};
