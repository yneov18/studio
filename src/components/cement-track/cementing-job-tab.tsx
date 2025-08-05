
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { JobData, Tank } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import type { Units } from "@/lib/conversions";
import { convertVolume, convertLevel } from "@/lib/conversions";

type CementingJobTabProps = {
    jobData: JobData;
    setJobData: Dispatch<SetStateAction<JobData>>;
    tanks: Tank[];
    setTanks: Dispatch<SetStateAction<Tank[]>>;
    units: Units;
};

export default function CementingJobTab({ jobData, setJobData, tanks, setTanks, units }: CementingJobTabProps) {

    const handleJobDataChange = (field: keyof JobData, value: number) => {
        // Value from input is always in the current display unit
        const valueInM3 = convertVolume(value, units.volume, 'm³');
        setJobData(prev => ({ ...prev, [field]: valueInM3 }));
    };

    const handleLevelChange = (tankId: string, stage: 'initial' | 'spacer' | 'lead' | 'tail', value: number) => {
        // Value from input is always in the current display unit
        const valueInCm = convertLevel(value, units.level, 'cm');
        const levelKey = `${stage}Level` as keyof Tank;
        setTanks(tanks.map(t => t.id === tankId ? { ...t, [levelKey]: valueInCm } : t));
    };

    const calculateVolumeFromLevel = (tank: Tank, levelCm?: number): number => {
        if (levelCm === undefined || levelCm === null) return 0;
        if (tank.height <= 0) return 0;
        
        let sensitivityLperCm: number;
        if (tank.sensitivity && tank.sensitivity > 0) {
            sensitivityLperCm = tank.sensitivity;
        } else {
            const totalVolumeL = calculateTotalVolume(tank) * 1000;
            if (totalVolumeL === 0) return 0;
            sensitivityLperCm = totalVolumeL / (tank.height * 100);
        }
        
        const volumeInLiters = sensitivityLperCm * levelCm;
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

    const pumpedSpacer = getStageVolume('spacer');
    const pumpedLead = getStageVolume('lead');
    const pumpedTail = getStageVolume('tail');

    const totalPumped = pumpedSpacer + pumpedLead + pumpedTail;
    const totalPlanned = jobData.spacerVolume + jobData.leadVolume + jobData.tailVolume;

    return (
        <div className="grid gap-6 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Données du Job de Cimentation</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Volume Spacer ({units.volume})</Label>
                        <Input type="number" value={convertVolume(jobData.spacerVolume, 'm³', units.volume)} onChange={e => handleJobDataChange('spacerVolume', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Volume Laitier de Tête ({units.volume})</Label>
                        <Input type="number" value={convertVolume(jobData.leadVolume, 'm³', units.volume)} onChange={e => handleJobDataChange('leadVolume', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Volume Laitier de Fond ({units.volume})</Label>
                        <Input type="number" value={convertVolume(jobData.tailVolume, 'm³', units.volume)} onChange={e => handleJobDataChange('tailVolume', parseFloat(e.target.value))} />
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
                                <TableHead>Niveau Initial ({units.level})</TableHead>
                                <TableHead>Niveau après Spacer ({units.level})</TableHead>
                                <TableHead>Niveau après Lead ({units.level})</TableHead>
                                <TableHead>Niveau après Tail ({units.level})</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanks.map(tank => (
                                <TableRow key={tank.id}>
                                    <TableCell className="font-medium">{tank.name}</TableCell>
                                    <TableCell><Input type="number" placeholder={units.level} value={tank.initialLevel !== undefined ? convertLevel(tank.initialLevel, 'cm', units.level) : ''} onChange={e => handleLevelChange(tank.id, 'initial', parseFloat(e.target.value))} /></TableCell>
                                    <TableCell><Input type="number" placeholder={units.level} value={tank.spacerLevel !== undefined ? convertLevel(tank.spacerLevel, 'cm', units.level) : ''} onChange={e => handleLevelChange(tank.id, 'spacer', parseFloat(e.target.value))} /></TableCell>
                                    <TableCell><Input type="number" placeholder={units.level} value={tank.leadLevel !== undefined ? convertLevel(tank.leadLevel, 'cm', units.level) : ''} onChange={e => handleLevelChange(tank.id, 'lead', parseFloat(e.target.value))} /></TableCell>
                                    <TableCell><Input type="number" placeholder={units.level} value={tank.tailLevel !== undefined ? convertLevel(tank.tailLevel, 'cm', units.level) : ''} onChange={e => handleLevelChange(tank.id, 'tail', parseFloat(e.target.value))} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-muted/50">
                                <TableHead>Volume Pompé ({units.volume})</TableHead>
                                <TableCell></TableCell>
                                <TableCell className="font-bold">{convertVolume(pumpedSpacer, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="font-bold">{convertVolume(pumpedLead, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="font-bold">{convertVolume(pumpedTail, 'm³', units.volume).toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="bg-secondary">
                                <TableHead colSpan={4}>Total Pompé / Total Prévu ({units.volume})</TableHead>
                                <TableCell className="font-extrabold text-lg">{convertVolume(totalPumped, 'm³', units.volume).toFixed(2)} / {convertVolume(totalPlanned, 'm³', units.volume).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
