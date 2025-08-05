"use client";

import type { JobData, Tank } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Units } from "@/lib/conversions";
import { convertVolume, convertLevel } from "@/lib/conversions";
import { format } from "date-fns";

type ReportTabProps = {
    rigName: string;
    jobData: JobData;
    tanks: Tank[];
    units: Units;
};

export default function ReportTab({ rigName, jobData, tanks, units }: ReportTabProps) {

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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 mt-4">
             <div className="flex justify-between items-start print:items-center print:flex-col print:gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Rapport de Cimentation</h1>
                    <p className="text-muted-foreground">
                        <strong>Appareil:</strong> {rigName} | <strong>Job:</strong> {jobData.jobName} | <strong>Date:</strong> {format(jobData.jobDate, "PPP")}
                    </p>
                </div>
                <Button onClick={handlePrint} className="no-print">
                    <Printer className="mr-2" /> Imprimer le Rapport
                </Button>
            </div>
            
            <Card className="printable-area">
                 <CardHeader>
                    <CardTitle>Détails du Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Volume Prévu ({units.volume})</TableHead>
                                <TableHead className="text-right">Volume Pompé ({units.volume})</TableHead>
                                <TableHead className="text-right">Écart ({units.volume})</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Spacer</TableCell>
                                <TableCell className="text-right">{convertVolume(jobData.spacerVolume, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{convertVolume(pumpedSpacer, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{(convertVolume(pumpedSpacer, 'm³', units.volume) - convertVolume(jobData.spacerVolume, 'm³', units.volume)).toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Laitier de Tête</TableCell>
                                <TableCell className="text-right">{convertVolume(jobData.leadVolume, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{convertVolume(pumpedLead, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{(convertVolume(pumpedLead, 'm³', units.volume) - convertVolume(jobData.leadVolume, 'm³', units.volume)).toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Laitier de Fond</TableCell>
                                <TableCell className="text-right">{convertVolume(jobData.tailVolume, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{convertVolume(pumpedTail, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{(convertVolume(pumpedTail, 'm³', units.volume) - convertVolume(jobData.tailVolume, 'm³', units.volume)).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow className="font-bold text-lg">
                                <TableHead>Total</TableHead>
                                <TableCell className="text-right">{convertVolume(totalPlanned, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{convertVolume(totalPumped, 'm³', units.volume).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{(convertVolume(totalPumped, 'm³', units.volume) - convertVolume(totalPlanned, 'm³', units.volume)).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>

             <Card className="printable-area">
                <CardHeader>
                    <CardTitle>Suivi des Niveaux des Bacs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bac</TableHead>
                                <TableHead className="text-right">Niveau Initial ({units.level})</TableHead>
                                <TableHead className="text-right">Niveau après Spacer ({units.level})</TableHead>
                                <TableHead className="text-right">Niveau après Lead ({units.level})</TableHead>
                                <TableHead className="text-right">Niveau après Tail ({units.level})</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanks.map(tank => (
                                <TableRow key={tank.id}>
                                    <TableCell>{tank.name}</TableCell>
                                    <TableCell className="text-right">{tank.initialLevel !== undefined ? convertLevel(tank.initialLevel, 'cm', units.level).toFixed(1) : 'N/A'}</TableCell>
                                    <TableCell className="text-right">{tank.spacerLevel !== undefined ? convertLevel(tank.spacerLevel, 'cm', units.level).toFixed(1) : 'N/A'}</TableCell>
                                    <TableCell className="text-right">{tank.leadLevel !== undefined ? convertLevel(tank.leadLevel, 'cm', units.level).toFixed(1) : 'N/A'}</TableCell>
                                    <TableCell className="text-right">{tank.tailLevel !== undefined ? convertLevel(tank.tailLevel, 'cm', units.level).toFixed(1) : 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
