import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { NavUserMenu } from "@/components/layout/user-menu";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/labs/new", label: "New Lab Entry" },
  { href: "/profile", label: "Profile" }
];

export async function SiteHeader() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background/80 py-4 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">HV</span>
        <span>HemoVita</span>
      </Link>
      <nav className="flex items-center gap-8">
        {session?.user ? (
          <>
            <div className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </div>
            <NavUserMenu user={session.user} />
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
