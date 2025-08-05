
"use client";

import type { Tank } from "@/app/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type TankDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (tank: Tank) => void;
  tank: Tank | null;
};

const defaultTank: Tank = {
    id: '',
    name: 'Nouveau Bac',
    shape: 'rectangular',
    height: 0,
    length: 0,
    width: 0,
    diameter: 0,
    sensitivity: 0,
};

export function TankDialog({ isOpen, onOpenChange, onSave, tank }: TankDialogProps) {
  const [currentTank, setCurrentTank] = useState<Tank>(defaultTank);

  useEffect(() => {
      if (isOpen) {
          if (tank) {
              setCurrentTank(tank);
          } else {
              setCurrentTank({ ...defaultTank, id: new Date().getTime().toString(), name: `Bac ${Math.floor(Math.random() * 1000)}` });
          }
      }
  }, [isOpen, tank]);

  const handleSave = () => {
    onSave(currentTank);
    onOpenChange(false);
  };
  
  const handleChange = (field: keyof Tank, value: string | number) => {
    setCurrentTank(prev => ({...prev, [field]: value}));
  };

  const handleShapeChange = (value: 'rectangular' | 'cylindrical') => {
      setCurrentTank(prev => ({ ...prev, shape: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tank ? "Modifier le Bac" : "Ajouter un Bac"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input id="name" value={currentTank.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shape" className="text-right">Forme</Label>
            <Select value={currentTank.shape} onValueChange={handleShapeChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangular">Rectangulaire</SelectItem>
                <SelectItem value="cylindrical">Cylindrique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">Hauteur (m)</Label>
            <Input id="height" type="number" value={currentTank.height || ''} onChange={e => handleChange('height', parseFloat(e.target.value) || 0)} className="col-span-3" />
          </div>
          {currentTank.shape === 'rectangular' ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="length" className="text-right">Longueur (m)</Label>
                <Input id="length" type="number" value={currentTank.length || ''} onChange={e => handleChange('length', parseFloat(e.target.value) || 0)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">Largeur (m)</Label>
                <Input id="width" type="number" value={currentTank.width || ''} onChange={e => handleChange('width', parseFloat(e.target.value) || 0)} className="col-span-3" />
              </div>
            </>
          ) : (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="diameter" className="text-right">Diamètre (m)</Label>
                <Input id="diameter" type="number" value={currentTank.diameter || ''} onChange={e => handleChange('diameter', parseFloat(e.target.value) || 0)} className="col-span-3" />
              </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sensitivity" className="text-right">Sensibilité (L/cm)</Label>
            <Input id="sensitivity" type="number" value={currentTank.sensitivity || ''} onChange={e => handleChange('sensitivity', parseFloat(e.target.value) || 0)} className="col-span-3" placeholder="Optionnel"/>
          </div>

        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
            </DialogClose>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

