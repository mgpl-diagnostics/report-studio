import Link from "next/link";

const LINKS = [
  { href: "/", label: "Reports" },
  { href: "/new", label: "Create report" },
  { href: "/invoice", label: "Invoices" },
  { href: "/letterhead", label: "Letterhead" },
];

/** App navigation — this UI belongs to the studio, not to the kits. */
export function Nav({ active }: { active: string }) {
  return (
    <div className="topnav">
      <strong>MGPL Report Studio</strong>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={l.href === active ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}
