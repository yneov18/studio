"use client";

import type { Units } from "@/lib/conversions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

type SettingsDialogProps = {
  children: ReactNode;
  units: Units;
  onUnitsChange: (units: Units) => void;
};

export function SettingsDialog({ children, units, onUnitsChange }: SettingsDialogProps) {

  const handleUnitChange = (category: keyof Units, value: string) => {
    onUnitsChange({ ...units, [category]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
          <DialogDescription>
            Modifier les unités de mesure utilisées dans l'application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>Longueur</Label>
            <Select value={units.length} onValueChange={(value) => handleUnitChange('length', value)}>
              <SelectTrigger className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">Mètres (m)</SelectItem>
                <SelectItem value="ft">Pieds (ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-3 items-center gap-4">
            <Label>Volume</Label>
            <Select value={units.volume} onValueChange={(value) => handleUnitChange('volume', value)}>
              <SelectTrigger className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m³">Mètres cubes (m³)</SelectItem>
                <SelectItem value="bbl">Barils (bbl)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-3 items-center gap-4">
            <Label>Niveau</Label>
            <Select value={units.level} onValueChange={(value) => handleUnitChange('level', value)}>
              <SelectTrigger className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">Centimètres (cm)</SelectItem>
                <SelectItem value="in">Pouces (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button>Fermer</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
