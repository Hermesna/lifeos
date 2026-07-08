export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          H
        </div>
      </div>
    </header>
  );
}