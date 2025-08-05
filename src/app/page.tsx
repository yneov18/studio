"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/cement-track/header";
import RigTanksTab from "@/components/cement-track/rig-tanks-tab";
import CementingJobTab from "@/components/cement-track/cementing-job-tab";
import ReportTab from "@/components/cement-track/report-tab";
import type { Units } from "@/lib/conversions";

export type Tank = {
  id: string;
  name: string;
  shape: 'rectangular' | 'cylindrical';
  height: number;
  length?: number;
  width?: number;
  diameter?: number;
  sensitivity?: number;
  initialLevel?: number;
  spacerLevel?: number;
  leadLevel?: number;
  tailLevel?: number;
};

export type JobData = {
  jobName: string;
  jobDate: Date;
  spacerVolume: number;
  leadVolume: number;
  tailVolume: number;
};

export default function CementTrackPage() {
  const [rigName, setRigName] = useState("Rig-01");
  const [tanks, setTanks] = useState<Tank[]>([
    { id: '1', name: 'Bac 1', shape: 'rectangular', height: 2, length: 5, width: 3 },
    { id: '2', name: 'Bac 2', shape: 'cylindrical', height: 2.5, diameter: 2 },
  ]);
  const [jobData, setJobData] = useState<JobData>({
    jobName: "Cimentation Puits XYZ-123",
    jobDate: new Date(),
    spacerVolume: 20,
    leadVolume: 50,
    tailVolume: 30,
  });
  const [units, setUnits] = useState<Units>({
    length: 'm',
    volume: 'm³',
    level: 'cm',
  });


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header units={units} setUnits={setUnits} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="rig-tanks" className="w-full">
          <TabsList className="no-print">
            <TabsTrigger value="rig-tanks">Appareil & Bacs</TabsTrigger>
            <TabsTrigger value="cementing-job">Job de Cimentation</TabsTrigger>
            <TabsTrigger value="report">Rapport</TabsTrigger>
          </TabsList>
          <TabsContent value="rig-tanks">
            <RigTanksTab 
              rigName={rigName}
              setRigName={setRigName}
              tanks={tanks}
              setTanks={setTanks}
              units={units}
            />
          </TabsContent>
          <TabsContent value="cementing-job">
            <CementingJobTab 
              jobData={jobData}
              setJobData={setJobData}
              tanks={tanks}
              setTanks={setTanks}
              units={units}
            />
          </TabsContent>
          <TabsContent value="report">
            <ReportTab 
              rigName={rigName}
              jobData={jobData}
              tanks={tanks}
              units={units}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
