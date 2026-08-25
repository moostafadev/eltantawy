"use client";

import { Table } from "@/components/table";

import { IProps } from "./types";
import { categoriesTableColumns } from "./CategoriesTableColumns";

const CategoriesTable = ({ categories }: IProps) => {
  return (
    <Table
      data={categories}
      columns={categoriesTableColumns}
      keyExtractor={(category) => category.id}
      emptyMessage="لا يوجد تصنيفات"
    />
  );
};

export default CategoriesTable;
