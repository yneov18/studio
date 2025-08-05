
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
import type { Units } from "@/lib/conversions";
import { convertLength } from "@/lib/conversions";

type TankDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (tank: Tank) => void;
  tank: Tank | null;
  units: Units;
};

const defaultTank: Omit<Tank, 'id'> = {
    name: 'Nouveau Bac',
    shape: 'rectangular',
    height: 0,
    length: 0,
    width: 0,
    diameter: 0,
    sensitivity: 0,
};

export function TankDialog({ isOpen, onOpenChange, onSave, tank, units }: TankDialogProps) {
  const [currentTank, setCurrentTank] = useState<Tank | Omit<Tank, 'id'>>(defaultTank);
  const [displayValues, setDisplayValues] = useState({
      height: '0',
      length: '0',
      width: '0',
      diameter: '0',
  });

  useEffect(() => {
      if (isOpen) {
          const tankToEdit = tank ? tank : { ...defaultTank, id: new Date().getTime().toString(), name: `Bac ${Math.floor(Math.random() * 1000)}` };
          setCurrentTank(tankToEdit);
          // Set display values based on metric data
          setDisplayValues({
              height: String(convertLength(tankToEdit.height || 0, 'm', units.length)),
              length: String(convertLength(tankToEdit.length || 0, 'm', units.length)),
              width: String(convertLength(tankToEdit.width || 0, 'm', units.length)),
              diameter: String(convertLength(tankToEdit.diameter || 0, 'm', units.length)),
          });
      }
  }, [isOpen, tank, units.length]);

  const handleSave = () => {
    onSave(currentTank as Tank);
    onOpenChange(false);
  };
  
  const handleDimensionChange = (field: 'height' | 'length' | 'width' | 'diameter', value: string) => {
      setDisplayValues(prev => ({...prev, [field]: value}));
      const numericValue = parseFloat(value) || 0;
      const valueInMeters = convertLength(numericValue, units.length, 'm');
      setCurrentTank(prev => ({ ...prev, [field]: valueInMeters }));
  }

  const handleOtherChange = (field: keyof Tank, value: string | number) => {
      setCurrentTank(prev => ({...prev, [field]: value}));
  }

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
            <Input id="name" value={currentTank.name} onChange={e => handleOtherChange('name', e.target.value)} className="col-span-3" />
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
            <Label htmlFor="height" className="text-right">Hauteur ({units.length})</Label>
            <Input id="height" type="number" value={displayValues.height} onChange={e => handleDimensionChange('height', e.target.value)} className="col-span-3" />
          </div>
          {currentTank.shape === 'rectangular' ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="length" className="text-right">Longueur ({units.length})</Label>
                <Input id="length" type="number" value={displayValues.length} onChange={e => handleDimensionChange('length', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">Largeur ({units.length})</Label>
                <Input id="width" type="number" value={displayValues.width} onChange={e => handleDimensionChange('width', e.target.value)} className="col-span-3" />
              </div>
            </>
          ) : (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="diameter" className="text-right">Diamètre ({units.length})</Label>
                <Input id="diameter" type="number" value={displayValues.diameter} onChange={e => handleDimensionChange('diameter', e.target.value)} className="col-span-3" />
              </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sensitivity" className="text-right">Sensibilité (L/cm)</Label>
            <Input id="sensitivity" type="number" value={currentTank.sensitivity || ''} onChange={e => handleOtherChange('sensitivity', parseFloat(e.target.value) || 0)} className="col-span-3" placeholder="Optionnel"/>
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
