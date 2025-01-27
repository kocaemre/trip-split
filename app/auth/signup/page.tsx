import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignUpForm from "./components/sign-up-form";

export const metadata: Metadata = {
  title: "Kayıt Ol - TripSplit",
  description: "TripSplit'e üye olun ve seyahat masraflarınızı kolayca yönetin.",
};

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hesap oluşturun
          </h1>
          <p className="text-sm text-muted-foreground">
            Email adresiniz ile kayıt olun veya GitHub hesabınız ile devam edin
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 