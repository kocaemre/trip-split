import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInForm from "./components/sign-in-form";

export const metadata: Metadata = {
  title: "Giriş Yap - TripSplit",
  description: "TripSplit hesabınıza giriş yapın.",
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hesabınıza giriş yapın
          </h1>
          <p className="text-sm text-muted-foreground">
            Email adresiniz veya GitHub hesabınız ile giriş yapın
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 