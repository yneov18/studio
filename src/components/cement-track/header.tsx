import type { Dispatch, SetStateAction } from "react";
import { Drill, Info, Mail, Phone, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsDialog } from "./settings-dialog";
import type { Units } from "@/lib/conversions";

type HeaderProps = {
  units: Units;
  setUnits: Dispatch<SetStateAction<Units>>;
}

export default function Header({ units, setUnits }: HeaderProps) {
  return (
    <header className="p-4 sm:p-6 border-b bg-card flex items-center justify-between shadow-sm no-print">
      <div className="flex items-center gap-3">
        <Drill className="h-10 w-10 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          CementTrack
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <SettingsDialog units={units} onUnitsChange={setUnits}>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </SettingsDialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Information</DialogTitle>
              <DialogDescription>
                Information about the application author.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Benamar Larbi</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href="tel:+213661277692" className="hover:underline">
                  +213661277692
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:lbenamar@newpark.com" className="hover:underline">
                  lbenamar@newpark.com
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
