import { Component, type ErrorInfo, type ReactNode } from "react";

import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import { appStorage } from "@/lib/store/idb-storage";

type Props = { children: ReactNode };
type State = { error: Error | null };

const STORE_KEY = "client-store";

/**
 * Last line of defence. Saved data is trusted when it's loaded, so a corrupted
 * record (or any other render error) would otherwise leave a blank page. This
 * offers a reload and, if that doesn't help, a reset of the saved data.
 */
class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Pennywise crashed:", error, info.componentStack);
  }

  resetData = async () => {
    await appStorage.removeItem(STORE_KEY);
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      // Storage blocked: nothing saved there to remove.
    }
    window.location.assign("/");
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen supports-[min-height:100dvh]:min-h-dvh flex items-center justify-center p-4">
        <div
          role="alert"
          className="w-full max-w-[560px] space-y-6 rounded-xl bg-white p-6 sm:p-8"
        >
          <Typography tag="h1">Something went wrong</Typography>
          <Typography variant="preset-4" className="text-grey-500">
            Pennywise hit an error, possibly because data saved in this browser
            can&apos;t be read. Try reloading first. If that doesn&apos;t help,
            resetting deletes everything saved here and starts again with the
            demo data.
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button size="xl" onClick={() => window.location.reload()}>
              Reload
            </Button>
            <Button size="xl" variant="outline" onClick={this.resetData}>
              Reset demo data
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
