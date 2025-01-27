"use client";

import { Button } from "@/components/ui/button";

export default function SentryExamplePage() {
  const throwError = () => {
    throw new Error("Sentry test hatası!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Sentry Test Sayfası
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Bu sayfa Sentry hata izleme sistemini test etmek için kullanılır.
            Aşağıdaki butona tıklayarak test hatası oluşturabilirsiniz.
          </p>
          <Button onClick={throwError} variant="destructive">
            Hata Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
} 