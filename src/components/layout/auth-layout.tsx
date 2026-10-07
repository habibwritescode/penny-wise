import Image from "next/image";
import useAuthRedirect from "@/lib/store/use-auth-redirect";

const AuthLayout = ({ children }: { children: React.ReactElement }) => {
  // Visitors here are almost always signed out, so render the form straight
  // away; signed-in users are redirected home once the store has loaded.
  useAuthRedirect("guest");

  return (
    <div className="h-screen flex items-center gap-36 p-5">
      <div className="max-h-full h-full flex items-center justify-center">
        <Image
          className="object-contain max-h-full"
          src="/assets/images/illustration.svg"
          alt=""
          width={560}
          height={920}
          priority
        />
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AuthLayout;
