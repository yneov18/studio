import type { Dispatch, SetStateAction } from "react";
import type { RealTimeParams, WellData } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Milestone, Ruler, Droplets, Wind, Gauge } from "lucide-react";

type DataInputCardProps = {
  wellData: WellData;
  setWellData: Dispatch<SetStateAction<WellData>>;
  realTimeParams: RealTimeParams;
  setRealTimeParams: Dispatch<SetStateAction<RealTimeParams>>;
};

export default function DataInputCard({
  wellData,
  setWellData,
  realTimeParams,
  setRealTimeParams,
}: DataInputCardProps) {
  const handleWellDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWellData((prev) => ({
      ...prev,
      [name]: name === "depth" || name === "diameter" ? parseFloat(value) : value,
    }));
  };

  const handleParamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRealTimeParams((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Scale />
          Well &amp; Cementing Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wellName">Well Name</Label>
            <Input
              id="wellName"
              name="wellName"
              value={wellData.wellName}
              onChange={handleWellDataChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDate">Job Date</Label>
            <Input
              id="jobDate"
              name="jobDate"
              type="date"
              value={wellData.jobDate}
              onChange={handleWellDataChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depth" className="flex items-center gap-2"><Milestone className="w-4 h-4"/>Depth (ft)</Label>
            <Input
              id="depth"
              name="depth"
              type="number"
              value={wellData.depth}
              onChange={handleWellDataChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diameter" className="flex items-center gap-2"><Ruler className="w-4 h-4"/>Diameter (in)</Label>
            <Input
              id="diameter"
              name="diameter"
              type="number"
              value={wellData.diameter}
              onChange={handleWellDataChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="geologicalInfo">Geological Information</Label>
          <Textarea
            id="geologicalInfo"
            name="geologicalInfo"
            value={wellData.geologicalInfo}
            onChange={handleWellDataChange}
            className="min-h-[60px]"
          />
        </div>
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Real-Time Parameters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slurryDensity" className="flex items-center gap-2"><Droplets className="w-4 h-4"/>Slurry Density (ppg)</Label>
              <Input
                id="slurryDensity"
                name="slurryDensity"
                type="number"
                value={realTimeParams.slurryDensity}
                onChange={handleParamsChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pumpRate" className="flex items-center gap-2"><Wind className="w-4 h-4"/>Pump Rate (bpm)</Label>
              <Input
                id="pumpRate"
                name="pumpRate"
                type="number"
                value={realTimeParams.pumpRate}
                onChange={handleParamsChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pressure" className="flex items-center gap-2"><Gauge className="w-4 h-4"/>Pressure (psi)</Label>
              <Input
                id="pressure"
                name="pressure"
                type="number"
                value={realTimeParams.pressure}
                onChange={handleParamsChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
