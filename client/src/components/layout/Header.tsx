export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="font-semibold text-slate-800">SmartERP Workspace</h2>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
        PS
      </div>
    </header>
  );
}