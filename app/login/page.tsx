import { CarFront } from "lucide-react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { LoginForm } from "./_components/login-form";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ redirectTo }, user] = await Promise.all([
    searchParams,
    getCurrentUser(),
  ]);

  if (user) {
    redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <CarFront className="size-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Вантажні перевезення
            </h1>
            <p className="text-sm text-muted-foreground">Операційна CRM</p>
          </div>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
