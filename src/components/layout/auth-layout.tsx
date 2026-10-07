import Head from "next/head";
import Image from "next/image";
import useAuthRedirect from "@/lib/store/use-auth-redirect";

const AuthLayout = ({ children }: { children: React.ReactElement }) => {
  // Visitors here are almost always signed out, so render the form straight
  // away; signed-in users are redirected home once the store has loaded.
  useAuthRedirect("guest");

  return (
    <>
      {/* Below lg the top of this page is the dark logo bar, so the browser
          chrome matches it; on desktop the top is the beige page. Replaces the
          app-wide tag via its key (the first matching theme-color wins). */}
      <Head>
        <meta
          name="theme-color"
          content="#201F24"
          media="(max-width: 1023px)"
          key="theme-color"
        />
        <meta
          name="theme-color"
          content="#F8F4F0"
          media="(min-width: 1024px)"
          key="theme-color-desktop"
        />
      </Head>
      <div className="min-h-screen flex flex-col lg:flex-row lg:items-center lg:h-screen lg:gap-12 xl:gap-36 lg:p-5">
        {/* Below lg there is no room for the illustration; show the logo bar instead. */}
        <header className="lg:hidden flex justify-center bg-grey-900 rounded-b-lg py-6">
          <Image
            src="/logo-full.svg"
            alt="Pennywise"
            width={134.73}
            height={24}
            priority
          />
        </header>

        <div className="hidden lg:flex max-h-full h-full items-center justify-center shrink-0">
          <Image
            className="object-contain max-h-full w-auto"
            src="/assets/images/illustration.svg"
            alt=""
            width={560}
            height={920}
            priority
          />
        </div>

        <main className="flex-1 flex items-center justify-center px-4 py-6 sm:px-10 lg:px-0">
          <div className="w-full max-w-[560px] bg-white rounded-xl px-5 py-6 sm:p-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
