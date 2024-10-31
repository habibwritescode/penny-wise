import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="h-screen flex items-center justify-between p-5">
      <div className="max-h-full h-full flex items-center justify-center">
        <Image
          className="object-contain max-h-full"
          src="/images/illustration.svg"
          alt=""
          width={560}
          height={920}
          priority
        />
      </div>

      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
