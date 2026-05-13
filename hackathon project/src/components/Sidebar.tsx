"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: "dashboard" },
  { name: "Submit Pitch", href: "/dashboard/submit", icon: "upload_file" },
  { name: "Future Growth Sim", href: "/dashboard/forecast", icon: "psychology" },
  { name: "Shark Tank Mode", href: "/dashboard/shark-tank", icon: "show_chart" },
  { name: "Battle Arena", href: "/dashboard/arena", icon: "sports_kabaddi" },
  { name: "Competitor Map", href: "/dashboard/competitors", icon: "map" },
  { name: "AI VC Insights", href: "/dashboard/insights", icon: "smart_toy" },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: "leaderboard" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 border-r border-white/10 bg-surface/40 backdrop-blur-2xl py-8 z-50">
      <div className="px-8 mb-12">
        <h1 className="text-headline-md font-headline-md font-bold tracking-tight text-primary">PitchRank AI</h1>
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={isActive
                  ? "text-primary bg-primary/10 border-l-4 border-primary px-6 py-3 flex items-center gap-4 transition-all duration-300"
                  : "text-on-surface-variant hover:text-on-surface px-6 py-3 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 active:scale-95"
                }
              >
                <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
                <span className={isActive ? "font-medium" : ""}>{item.name}</span>
              </div>
            </Link>
          );
        })}
        <div className="mt-auto pt-4">
          <Link href="#">
            <div className="text-on-surface-variant hover:text-on-surface px-6 py-3 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 active:scale-95">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
