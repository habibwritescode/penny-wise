import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import useBoundStore from "@/lib/store/store";
import { DEMO_USER } from "@/utils/constants";

const DemoAccess = () => {
  const signIn = useBoundStore((store) => store.signIn);

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        size="xl"
        variant="outline"
        type="button"
        onClick={() => signIn(DEMO_USER)}
      >
        Try the demo
      </Button>

      <Typography variant="preset-5" className="text-center text-grey-500">
        This is a demo app: any email and password will work. Nothing is sent
        to a server and your data stays in this browser.
      </Typography>
    </div>
  );
};

export default DemoAccess;
