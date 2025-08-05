import { Drill, Construction, TowerControl } from "lucide-react";

export default function Header() {
  return (
    <header className="p-4 sm:p-6 border-b bg-card flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4 p-2 border rounded-lg">
            <p className="text-sm text-muted-foreground">Option 1:</p>
            <Drill className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground ml-4">Option 2:</p>
            <Construction className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground ml-4">Option 3:</p>
            <TowerControl className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight ml-4">
          CementTrack
        </h1>
      </div>
    </header>
  );
}
