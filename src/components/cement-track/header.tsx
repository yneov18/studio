import { CustomOilDerrick } from "@/components/icons";

export default function Header() {
  return (
    <header className="p-4 sm:p-6 border-b bg-card flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <CustomOilDerrick className="h-8 w-8 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          CementTrack
        </h1>
      </div>
    </header>
  );
}
