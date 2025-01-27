import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "./components/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Geri Dön Linki */}
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Ana Sayfa
            </Link>
          </div>

          {/* Giriş Kartı */}
          <div className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  TripSplit'e Hoş Geldiniz
                </h1>
                <p className="mt-2 text-gray-600">
                  Hesabınıza giriş yaparak seyahatlerinizi yönetmeye başlayın
                </p>
              </div>

              <LoginForm />

              <div className="mt-6 text-center text-sm text-gray-500">
                Hesabınız yok mu?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Hemen kayıt olun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 