import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Plane, Users2, Receipt } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <BackgroundGradientAnimation>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          {/* Hero Section */}
          <div className="space-y-8 max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
              <Wallet className="w-4 h-4 mr-2" />
              Seyahat masraflarınızı kolayca yönetin
            </div>
            
            <h1 className="text-6xl font-bold text-white">
              TripSplit ile Seyahatleriniz Daha Kolay
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Arkadaşlarınızla çıktığınız seyahatlerde masrafları takip etmek ve paylaşmak hiç bu kadar kolay olmamıştı.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white/10 hover:bg-white/20">
                <Link href="/auth/login">Giriş Yap</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-black hover:bg-white/90">
                <Link href="/auth/register">Kayıt Ol</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Users2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Grup Yönetimi</h3>
              <p className="text-white/60">
                Seyahat grupları oluşturun ve arkadaşlarınızı davet edin.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Seyahat Takibi</h3>
              <p className="text-white/60">
                Her seyahat için ayrı masraf takibi yapın.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Masraf Hesaplama</h3>
              <p className="text-white/60">
                Kimin ne kadar ödediğini ve kime ne kadar borcu olduğunu görün.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
