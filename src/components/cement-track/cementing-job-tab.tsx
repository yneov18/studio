
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { JobData, Tank } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";

type CementingJobTabProps = {
    jobData: JobData;
    setJobData: Dispatch<SetStateAction<JobData>>;
    tanks: Tank[];
    setTanks: Dispatch<SetStateAction<Tank[]>>;
};

export default function CementingJobTab({ jobData, setJobData, tanks, setTanks }: CementingJobTabProps) {

    const handleJobDataChange = (field: keyof JobData, value: number) => {
        setJobData(prev => ({ ...prev, [field]: value }));
    };

    const handleLevelChange = (tankId: string, stage: 'initial' | 'spacer' | 'lead' | 'tail', value: number) => {
        const levelKey = `${stage}Level` as keyof Tank;
        setTanks(tanks.map(t => t.id === tankId ? { ...t, [levelKey]: value } : t));
    };

    const calculateVolumeFromLevel = (tank: Tank, level?: number): number => {
        if (level === undefined || level === null) return 0;
        if (tank.height <= 0) return 0;
        
        let sensitivityLperCm: number;
        if (tank.sensitivity && tank.sensitivity > 0) {
            sensitivityLperCm = tank.sensitivity;
        } else {
            const totalVolumeL = calculateTotalVolume(tank) * 1000;
            if (totalVolumeL === 0) return 0;
            sensitivityLperCm = totalVolumeL / (tank.height * 100);
        }
        
        const volumeInLiters = sensitivityLperCm * level;
        return volumeInLiters / 1000; // Convert to m³
    };
    
    const calculateTotalVolume = (tank: Tank) => {
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
    }

    const getStageVolume = (stage: 'spacer' | 'lead' | 'tail') => {
        return tanks.reduce((total, tank) => {
            const initialVolume = calculateVolumeFromLevel(tank, tank.initialLevel);
            const stageVolume = calculateVolumeFromLevel(tank, tank[`${stage}Level` as keyof Tank] as number);
            
            let previousStageVolume: number;
            if(stage === 'spacer') {
                previousStageVolume = initialVolume;
            } else if (stage === 'lead') {
                previousStageVolume = calculateVolumeFromLevel(tank, tank.spacerLevel);
            } else { // tail
                previousStageVolume = calculateVolumeFromLevel(tank, tank.leadLevel);
            }
            
            // If the level for the current stage has been entered, calculate the difference from the previous stage
            if(stageVolume > 0) {
                return total + (previousStageVolume - stageVolume);
            }
            return total;
        }, 0);
    };

    const totalPumped = getStageVolume('spacer') + getStageVolume('lead') + getStageVolume('tail');
    const totalPlanned = jobData.spacerVolume + jobData.leadVolume + jobData.tailVolume;

    return (
        <div className="grid gap-6 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Données du Job de Cimentation</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Volume Spacer (m³)</Label>
                        <Input type="number" value={jobData.spacerVolume} onChange={e => handleJobDataChange('spacerVolume', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Volume Laitier de Tête (m³)</Label>
                        <Input type="number" value={jobData.leadVolume} onChange={e => handleJobDataChange('leadVolume', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Volume Laitier de Fond (m³)</Label>
                        <Input type="number" value={jobData.tailVolume} onChange={e => handleJobDataChange('tailVolume', parseFloat(e.target.value))} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Suivi des Volumes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bac</TableHead>
                                <TableHead>Niveau Initial (cm)</TableHead>
                                <TableHead>Niveau après Spacer (cm)</TableHead>
                                <TableHead>Niveau après Lead (cm)</TableHead>
                                <TableHead>Niveau après Tail (cm)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanks.map(tank => (
                                <TableRow key={tank.id}>
                                    <TableCell className="font-medium">{tank.name}</TableCell>
                                    <TableCell><Input type="number" placeholder="cm" value={tank.initialLevel || ''} onChange={e => handleLevelChange(tank.id, 'initial', parseFloat(e.target.value))} /></TableCell>
                                    <TableCell><Input type="number" placeholder="cm" value={tank.spacerLevel || ''} onChange={e => handleLevelChange(tank.id, 'spacer', parseFloat(e.target.value))} /></TableCell>
                                    <TableCell><Input type="number" placeholder="cm" value={tank.leadLevel || ''} onChange={e => handleLevelChange(tank.id, 'lead', parseFloat(e.target.value))} /></TableCell>
                                    <TableCell><Input type="number" placeholder="cm" value={tank.tailLevel || ''} onChange={e => handleLevelChange(tank.id, 'tail', parseFloat(e.target.value))} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-muted/50">
                                <TableHead>Volume Pompé (m³)</TableHead>
                                <TableCell></TableCell>
                                <TableCell className="font-bold">{getStageVolume('spacer').toFixed(2)}</TableCell>
                                <TableCell className="font-bold">{getStageVolume('lead').toFixed(2)}</TableCell>
                                <TableCell className="font-bold">{getStageVolume('tail').toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="bg-secondary">
                                <TableHead colSpan={4}>Total Pompé / Total Prévu (m³)</TableHead>
                                <TableCell className="font-extrabold text-lg">{totalPumped.toFixed(2)} / {totalPlanned.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
