import { cn } from "@/lib/utils";

const Block = ({ className }: { className: string }) => (
  <div
    className={cn("rounded-xl bg-white motion-safe:animate-pulse", className)}
  />
);

// Generic page placeholder shown while persisted data loads on first visit.
const PageSkeleton = () => (
  <div aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading…</span>

    <Block className="h-10 w-48" />

    <div className="mt-10 grid gap-6 md:grid-cols-3">
      <Block className="h-28" />
      <Block className="h-28" />
      <Block className="h-28" />
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-10">
      <Block className="h-96 xl:col-span-6" />
      <Block className="h-96 xl:col-span-4" />
    </div>
  </div>
);

export default PageSkeleton;
