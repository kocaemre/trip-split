import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegisterForm from "./components/register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-purple-50 to-white">
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

          {/* Kayıt Kartı */}
          <div className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  TripSplit'e Hoş Geldiniz
                </h1>
                <p className="mt-2 text-gray-600">
                  Hesap oluşturarak seyahatlerinizi yönetmeye başlayın
                </p>
              </div>

              <RegisterForm />

              <div className="mt-6 text-center text-sm text-gray-500">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Giriş yapın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 