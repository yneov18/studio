import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ListChecks } from "lucide-react";

type EventLogCardProps = {
  events: string[];
  setEvents: Dispatch<SetStateAction<string[]>>;
};

export default function EventLogCard({ events, setEvents }: EventLogCardProps) {
  const [newEvent, setNewEvent] = useState("");

  const handleAddEvent = () => {
    if (newEvent.trim() === "") return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setEvents((prev) => [`${timestamp} - ${newEvent}`, ...prev]);
    setNewEvent("");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListChecks />
          Event Log
        </CardTitle>
        <CardDescription>
          Log all events and changes during the job.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type event details here..."
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAddEvent} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
        <ScrollArea className="h-48 w-full rounded-md border p-4">
          {events.length > 0 ? (
            <div className="space-y-2 text-sm">
              {events.map((event, index) => (
                <p key={index} className="text-muted-foreground">
                  {event}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No events logged yet.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
