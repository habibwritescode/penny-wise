import { DataTable } from "@/components/data-table/data-table";
import { LabeledDropdown } from "@/components/labeled-dropdown";
import SearchInput from "@/components/search-input";
import data from "@/utils/data.json";
import { SORT_OPTIONS, SortFilter } from "@/utils/types";
import { useState } from "react";
import columns from "../columns";
import { filterAndSortTransactions } from "../../transactions/utils";

const RecurringBillsTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter | "">("");

  const recurringBills = data.transactions.filter((item) => item.recurring);

  const transactions = filterAndSortTransactions({
    transactions: recurringBills,
    sortFilter,
    searchValue,
  });

  return (
    <div className="bg-white p-8 rounded-xl">
      <div className="flex justify-between gap-6 mb-6">
        <SearchInput
          placeholder="Search bills"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />

        <div className="flex gap-6">
          <LabeledDropdown
            label="Sort by"
            options={SORT_OPTIONS}
            onChange={(value) => setSortFilter(value as SortFilter)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={transactions} />
    </div>
  );
};

export default RecurringBillsTable;
