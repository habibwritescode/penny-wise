import Link from "next/link";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "./_app";
import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";

const NotFound: NextPageWithLayout = () => {
  return (
    <main className="min-h-screen supports-[min-height:100dvh]:min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-[560px] space-y-6 rounded-xl bg-white p-6 sm:p-8">
        <Typography tag="h1">Page not found</Typography>
        <Typography variant="preset-4" className="text-grey-500">
          This page doesn&apos;t exist. The link may be mistyped or out of date.
        </Typography>
        <Button size="xl" asChild>
          <Link href="/">Go to Overview</Link>
        </Button>
      </div>
    </main>
  );
};

// Standalone, like the error screen: the app layout's route guard would send
// signed-out visitors to the login page instead of saying the page is missing.
NotFound.getLayout = (page: ReactElement) => page;

export default NotFound;
