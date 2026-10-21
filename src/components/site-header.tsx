import Link from "next/link";
import { isAdmin } from "@/lib/auth";

const links = [
  { href: "/#work", label: "Работы" },
  { href: "/projects", label: "Кейсы" },
  { href: "/#contact", label: "Контакт" },
];

export async function SiteHeader() {
  const admin = await isAdmin();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight">
          Brand Designer
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-paper">
              {link.label}
            </Link>
          ))}
          <Link
            href={admin ? "/admin" : "/admin/login"}
            className="rounded-full border border-line px-3 py-1.5 text-paper hover:border-ember"
          >
            {admin ? "Кабинет" : "Admin"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
