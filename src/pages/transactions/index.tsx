import { useState } from "react";

import Typography from "@/components/typography";
import { columns } from "./columns";
import { DataTable } from "../../components/data-table";
import data from "../../../data.json";
import SearchInput from "@/components/search-input";
import { LabeledDropdown } from "@/components/labeled-dropdown";
import {
  CATEGORY_OPTIONS,
  CategoryFilter,
  filterAndSortTransactions,
  SORT_OPTIONS,
  SortFilter,
} from "./utils";

const Transactions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter | "">("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter | "">("");

  const transactions = filterAndSortTransactions({
    transactions: data.transactions,
    sortFilter,
    categoryFilter,
    searchValue,
  });

  return (
    <div>
      <Typography tag="h1">Transactions</Typography>

      <div className="mt-10 bg-white p-8">
        <div className="flex justify-between gap-6 mb-6">
          <SearchInput
            placeholder="Search transactions"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <div className="flex gap-6">
            <LabeledDropdown
              label="Sort by"
              options={SORT_OPTIONS}
              onChange={(value) => setSortFilter(value as SortFilter)}
            />
            <LabeledDropdown
              label="Category"
              options={CATEGORY_OPTIONS}
              onChange={(value) => setCategoryFilter(value)}
            />
          </div>
        </div>

        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
};

export default Transactions;
