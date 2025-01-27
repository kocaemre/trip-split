import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Plane, Users2, Receipt } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          {/* Hero Section */}
          <div className="space-y-8 max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium">
              <Wallet className="w-4 h-4 mr-2" />
              Seyahat masraflarınızı kolayca yönetin
            </div>
            
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              TripSplit ile Seyahatleriniz Daha Kolay
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Arkadaşlarınızla çıktığınız seyahatlerde masrafları takip etmek ve paylaşmak hiç bu kadar kolay olmamıştı.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link href="/auth/login">Giriş Yap</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2">
                <Link href="/auth/register">Kayıt Ol</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Users2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Grup Yönetimi</h3>
              <p className="text-gray-600">
                Seyahat grupları oluşturun ve arkadaşlarınızı davet edin.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seyahat Takibi</h3>
              <p className="text-gray-600">
                Her seyahat için ayrı masraf takibi yapın.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Masraf Hesaplama</h3>
              <p className="text-gray-600">
                Kimin ne kadar ödediğini ve kime ne kadar borcu olduğunu görün.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
