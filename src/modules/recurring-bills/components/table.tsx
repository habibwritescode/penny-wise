import { useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { LabeledDropdown } from "@/components/labeled-dropdown";
import SearchInput from "@/components/search-input";
import useBoundStore from "@/lib/store/store";
import { todayLocal } from "@/utils/local-date";
import columns from "../columns";
import {
  BILL_SORT_OPTIONS,
  getBillRows,
  sortBillRows,
  type BillSort,
} from "../utils";
import FilterIcon from "../../../../public/assets/icons/filter.svg";

const RecurringBillsTable = () => {
  const bills = useBoundStore((store) => store.bills);
  const occurrences = useBoundStore((store) => store.occurrences);

  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<BillSort>("due");
  const today = todayLocal();

  // Memoised so the table only resets to page 1 when the data or filters change.
  const rows = useMemo(
    () =>
      sortBillRows(getBillRows(bills, occurrences, today), sort, searchValue),
    [bills, occurrences, today, sort, searchValue]
  );

  return (
    <div className="bg-white p-5 sm:p-8 rounded-xl">
      <div className="flex justify-between gap-4 sm:gap-6 mb-6">
        <SearchInput
          placeholder="Search bills"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />

        <div className="flex shrink-0 gap-4 sm:gap-6">
          <LabeledDropdown
            label="Sort by"
            options={[...BILL_SORT_OPTIONS]}
            onChange={(value) => setSort(value as BillSort)}
            icon={<FilterIcon />}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.bill.id}
      />
    </div>
  );
};

export default RecurringBillsTable;
