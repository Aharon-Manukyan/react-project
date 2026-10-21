import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <p className="text-xs tracking-[0.28em] text-gold uppercase">Studio OS</p>
      <h1 className="mt-3 font-serif text-4xl">Вход в кабинет</h1>
      <LoginForm />
    </main>
  );
}
