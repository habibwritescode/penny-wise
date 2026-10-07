import "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- generics must match TanStack's declaration
  interface ColumnMeta<TData extends RowData, TValue> {
    // Applied by DataTable to the column's header and body cells,
    // e.g. "hidden md:table-cell" to drop a column on small screens.
    className?: string;
  }
}
