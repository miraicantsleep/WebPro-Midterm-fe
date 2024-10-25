import { PropsWithChildren } from "react";
export default function DashboardLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <main  className="min-h-screen w-full bg-slate-50">
        {children}
      </main>
    </>
  );
}