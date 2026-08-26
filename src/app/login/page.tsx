import { FormLogin } from "@/features/client/auth/login";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex flex-1 items-stretch bg-background-second/20 lg:bg-background">
      <div className="flex-1 h-full p-4 my-auto flex justify-center items-center">
        <FormLogin />
      </div>

      <div className="flex-1 min-h-full hidden items-center justify-center p-4 bg-linear-to-b from-white via-background-second/30 to-white lg:flex">
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

export default Login;
