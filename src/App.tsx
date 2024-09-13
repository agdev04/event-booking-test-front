"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateEventForm } from "./components/create-event-form";
import { EventCard } from "./components/event-card";
import EventApi from "../api/event";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
}

const event_api = new EventApi();

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [action, setAction] = useState<number | 0>(0);

  useEffect(() => {
    (async () => {
      const events = await event_api.getEvents();
      setEvents(events);
    })();
  }, [action]);

  const addEvent = async (newEvent: Omit<Event, "id">) => {
    const result = await event_api.createEvent(newEvent);

    if (result) {
      setAction((prev) => prev + 1);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-8 text-4xl font-bold">Event Booking Test</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Add a new event for booking</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateEventForm onSubmit={addEvent} />
          </CardContent>
        </Card>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Book your spot for these events</CardDescription>
          </CardHeader>
          <CardContent className="h-[76vh] overflow-y-scroll">
            {events.length === 0 ? (
              <p>No events available. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
