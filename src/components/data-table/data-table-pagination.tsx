import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
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

const TablePagination = ({
  totalPages,
  currentPage,
  setPage,
  onPrevious,
  onNext,
  isPreviousPageDisabled,
  isNextPageDisabled,
}: Props) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

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
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setPage(page - 1)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>

        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}

        <PaginationItem>
          <PaginationNext onClick={onNext} disabled={isNextPageDisabled} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
