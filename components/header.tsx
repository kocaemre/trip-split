import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100/20 bg-white/70 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              TripSplit
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {session?.user?.name}
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
} 