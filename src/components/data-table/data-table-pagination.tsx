import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isPreviousPageDisabled: boolean;
  isNextPageDisabled: boolean;
};

// First, last, and the pages either side of the current one; gaps become ellipses.
export const getVisiblePages = (totalPages: number, currentPage: number) => {
  const pages: (number | "ellipsis")[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const isEdge = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= 1;

    if (isEdge || isNearCurrent) {
      pages.push(page);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return pages;
};

const TablePagination = ({
  totalPages,
  currentPage,
  setPage,
  onPrevious,
  onNext,
  isPreviousPageDisabled,
  isNextPageDisabled,
}: Props) => {
  const pages = getVisiblePages(totalPages, currentPage);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPrevious}
            disabled={isPreviousPageDisabled}
          />
        </PaginationItem>

        <div className="flex gap-2">
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setPage(page - 1)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
        </div>

        <PaginationItem>
          <PaginationNext onClick={onNext} disabled={isNextPageDisabled} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
