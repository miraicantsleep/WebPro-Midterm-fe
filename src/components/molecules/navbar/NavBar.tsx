"use client";
import NavLink from "@/components/atoms/navbar/NavLink";

type PanelLink = {
  href: string;
  label: string;
};

const panelLinks: PanelLink[] = [
  {
    href: "/dashboard",
    label: "Personal",
  },
  {
    href: "/dashboard/communal",
    label: "Communal",
  },
];

export default function Navbar() {
  const role = localStorage.getItem('role'); // Retrieve the role from localStorage
  const isAdmin = role === 'ADMIN'; // Check if the user is an admin

  return (
    <header className="sticky z-50 top-0 flex items-center w-full h-16 gap-4 border-b bg-background">
      <nav className="container hidden md:flex justify-between">
        <div className="flex flex-row items-center font-medium gap-5 text-sm mx-10">
          {panelLinks.map((link) => {
            // Only render the "Communal" link if the user is an admin
            if (link.label === "Communal" && !isAdmin) {
              return null; // Do not render this link if not an admin
            }
            return (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
