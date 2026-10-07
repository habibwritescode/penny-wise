import { useMemo, useState } from "react";

import Typography from "@/components/typography";
import { DataTable } from "@/components/data-table/data-table";
import SearchInput from "@/components/search-input";
import { LabeledDropdown } from "@/components/labeled-dropdown";
import {
  CATEGORY_FILTER_OPTIONS,
  ICategoryFilter,
  filterAndSortTransactions,
} from "./utils";
import columns from "./columns";
import { SORT_OPTIONS, SortFilter } from "@/utils/types";
import { Button } from "@/components/ui/button";
import AddTransaction from "./components/add-transaction";
import useBoundStore from "@/lib/store/store";
import SortIcon from "../../../public/assets/icons/sort.svg";
import FilterIcon from "../../../public/assets/icons/filter.svg";

const TransactionsPage = () => {
  const transactions = useBoundStore((store) => store.transactions);

  const [openModal, setOpenModal] = useState<"add-transaction" | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter | "">("latest");
  const [categoryFilter, setCategoryFilter] = useState<ICategoryFilter | "">(
    "All"
  );

  // Memoised so the table only resets to page 1 when the filters change.
  const filteredTransactions = useMemo(
    () =>
      filterAndSortTransactions({
        transactions,
        sortFilter,
        categoryFilter,
        searchValue,
      }),
    [transactions, sortFilter, categoryFilter, searchValue]
  );

  const handleCloseModal = () => setOpenModal(null);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Typography tag="h1">Transactions</Typography>

        <Button
          className="rounded-[8px]"
          size="xl"
          onClick={() => setOpenModal("add-transaction")}
        >
          <Typography tag="span" variant="preset-4-bold" className="text-white">
            + Add Transaction
          </Typography>
        </Button>
      </div>

      <div className="mt-10 bg-white p-8 rounded-xl">
        <div className="flex justify-between gap-4 sm:gap-6 mb-6">
          <SearchInput
            placeholder="Search transactions"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <div className="flex shrink-0 gap-4 sm:gap-6">
            <LabeledDropdown
              label="Sort by"
              options={SORT_OPTIONS}
              onChange={(value) => setSortFilter(value as SortFilter)}
              icon={<SortIcon />}
            />
            <LabeledDropdown
              label="Category"
              options={CATEGORY_FILTER_OPTIONS}
              onChange={(value) => setCategoryFilter(value as ICategoryFilter)}
              icon={<FilterIcon />}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTransactions}
          getRowId={(transaction) => transaction.id}
        />
      </div>

      <AddTransaction
        isOpen={openModal === "add-transaction"}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TransactionsPage;
