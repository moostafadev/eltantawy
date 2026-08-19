import { VerifyEmailContent } from "@/features/client/auth/verification-code";
import Image from "next/image";

const VerifyEmail = () => {
  return (
    <div className="h-full flex">
      <div className="flex w-full flex-1 items-center justify-center p-4 sm:p-8 ">
        <div className="w-full max-w-xl">
          <div className="mb-4 flex justify-center lg:hidden">
            <Image
              src="/logo-alt.png"
              alt="الطنطاوي"
              width={180}
              height={180}
              priority
            />
          </div>
          <VerifyEmailContent />
        </div>
      </div>
      <div className="flex-1 h-full hidden items-center justify-center p-4 bg-linear-to-b from-white via-background-second/30 to-white lg:flex">
        <Image
          src="/logo-alt.png"
          alt="الطنطاوي"
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  );
};

export default VerifyEmail;
