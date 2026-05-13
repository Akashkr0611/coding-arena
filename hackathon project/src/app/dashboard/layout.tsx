import { Sidebar } from "@/components/Sidebar";

function TopHeader() {
  return (
    <header className="fixed top-4 right-4 left-4 md:left-80 rounded-xl border border-white/10 bg-surface-variant/60 backdrop-blur-3xl shadow-[0_0_20px_rgba(0,218,243,0.1)] flex justify-between items-center px-8 py-4 z-40">
      <h2 className="font-headline-md text-headline-md text-primary">Command Center</h2>
      <div className="flex items-center gap-6">
        <span className="material-symbols-outlined text-primary cursor-pointer active:opacity-80" data-icon="search">search</span>
        <div className="h-8 w-[1px] bg-white/10"></div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary" data-icon="sensors">sensors</span>
          <span className="text-label-sm uppercase tracking-widest text-secondary">Live Analysis</span>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-6 z-50">
      <a className="text-primary flex flex-col items-center gap-1" href="#">
        <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
        <span className="text-[10px] font-bold uppercase">Home</span>
      </a>
      <a className="text-on-surface-variant flex flex-col items-center gap-1" href="#">
        <span className="material-symbols-outlined" data-icon="upload_file">upload_file</span>
        <span className="text-[10px] font-bold uppercase">Pitch</span>
      </a>
      <div className="bg-primary -mt-10 p-4 rounded-full shadow-lg shadow-primary/40 border-4 border-surface active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-on-primary font-bold" data-icon="add">add</span>
      </div>
      <a className="text-on-surface-variant flex flex-col items-center gap-1" href="#">
        <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
        <span className="text-[10px] font-bold uppercase">Stats</span>
      </a>
      <a className="text-on-surface-variant flex flex-col items-center gap-1" href="#">
        <span className="material-symbols-outlined" data-icon="settings">settings</span>
        <span className="text-[10px] font-bold uppercase">Settings</span>
      </a>
    </footer>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopHeader />
      <main className="md:pl-80 pt-28 pb-12 px-6">
        <div className="max-w-max-width mx-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

