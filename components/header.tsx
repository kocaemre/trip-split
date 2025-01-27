import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="font-semibold text-xl">
            TripSplit
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session?.user?.name}
            </span>
            <form action="/api/auth/signout" method="POST">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
} 