
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Tank } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, FolderOpen, Pencil, Drill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useRef, useState } from 'react';
import { TankDialog } from "./tank-dialog";

type RigTanksTabProps = {
    rigName: string;
    setRigName: Dispatch<SetStateAction<string>>;
    tanks: Tank[];
    setTanks: Dispatch<SetStateAction<Tank[]>>;
};

export default function RigTanksTab({ rigName, setRigName, tanks, setTanks }: RigTanksTabProps) {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTank, setEditingTank] = useState<Tank | null>(null);

    const addTank = (tank: Tank) => {
        setTanks([...tanks, tank]);
    };

    const updateTank = (updatedTank: Tank) => {
        setTanks(tanks.map(tank => tank.id === updatedTank.id ? updatedTank : tank));
    };

    const removeTank = (id: string) => {
        setTanks(tanks.filter(tank => tank.id !== id));
    };
    
    const calculateVolume = (tank: Tank) => {
        if (tank.height <= 0) return 0;
        if (tank.sensitivity && tank.sensitivity > 0) {
            return (tank.sensitivity * tank.height * 100) / 1000; // m³
        }
        if (tank.shape === 'rectangular' && tank.length && tank.width) {
            return tank.length * tank.width * tank.height; // m³
        }
        if (tank.shape === 'cylindrical' && tank.diameter) {
            return (Math.PI * (tank.diameter / 2) ** 2 * tank.height); // m³
        }
        return 0;
    };
    
    const calculateSensitivity = (tank: Tank) => {
        if (tank.sensitivity && tank.sensitivity > 0) {
            return tank.sensitivity; // L/cm
        }
        if (tank.height <= 0) return 0;
        const volume = calculateVolume(tank) * 1000; // in Liters
        if (volume <= 0) return 0;
        return volume / (tank.height * 100); // L/cm
    };

    const handleAddNewTank = () => {
        setEditingTank(null);
        setIsDialogOpen(true);
    };

    const handleEditTank = (tank: Tank) => {
        setEditingTank(tank);
        setIsDialogOpen(true);
    };

    const handleSaveTank = (tank: Tank) => {
        if(editingTank) {
            updateTank(tank);
        } else {
            addTank(tank);
        }
    };


    const saveConfiguration = () => {
        try {
            const config = { rigName, tanks };
            const configString = JSON.stringify(config, null, 2);
            const blob = new Blob([configString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${rigName.replace(/\s+/g, '_') || 'config'}-cimentation.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Configuration Enregistrée",
                description: "Le fichier de configuration a été téléchargé.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer la configuration.",
                variant: "destructive",
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const { rigName, tanks } = JSON.parse(text);
                    setRigName(rigName);
                    setTanks(tanks);
                    toast({
                        title: "Configuration Chargée",
                        description: "La configuration a été chargée avec succès.",
                    });
                }
            } catch (error) {
                toast({
                    title: "Erreur de Lecture",
                    description: "Impossible de lire ou de parser le fichier de configuration.",
                    variant: "destructive",
                });
            }
        };
        reader.onerror = () => {
             toast({
                title: "Erreur",
                description: "Impossible de lire le fichier.",
                variant: "destructive",
            });
        }
        reader.readAsText(file);
        
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const loadConfiguration = () => {
       fileInputRef.current?.click();
    };


    return (
        <div className="grid gap-6 mt-4">
            <TankDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveTank}
                tank={editingTank}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><Drill /> Informations sur l'appareil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                         <Label>Nom de l'appareil de forage</Label>
                         <Input value={rigName} onChange={(e) => setRigName(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={saveConfiguration}><Save className="mr-2"/> Enregistrer la Configuration</Button>
                        <Button onClick={loadConfiguration} variant="outline"><FolderOpen className="mr-2"/> Charger la Configuration</Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bacs à Boue</CardTitle>
                    <CardDescription>Définir les caractéristiques de chaque bac.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Sensibilité (L/cm)</TableHead>
                                <TableHead>Volume Total (m³)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanks.map((tank) => (
                                <TableRow key={tank.id}>
                                    <TableCell className="font-medium">{tank.name}</TableCell>
                                    <TableCell>{calculateSensitivity(tank).toFixed(2)}</TableCell>
                                    <TableCell>{calculateVolume(tank).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditTank(tank)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => removeTank(tank.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button onClick={handleAddNewTank} className="w-full">
                        <Plus className="mr-2" /> Ajouter un Bac
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
