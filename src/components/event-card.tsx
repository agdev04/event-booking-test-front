import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EventApi from "../../api/event";
import BookingApi from "../../api/booking";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface Booking {
  id: number;
  eventId: number;
  start_time: string;
  end_time: string;
}

interface EventCardProps {
  event: Event;
}

interface CreateBooking {
  event_id: number;
  name: string;
  email: string;
  start_time: string;
  end_time: string;
}

const events_api = new EventApi();
const booking_api = new BookingApi();

export function EventCard({ event }: EventCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [action, setAction] = useState<number | 0>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await events_api.getBookingByEvent(event.id.toString());
      setBookings(result);
    })();
  }, [action]);

  if (!event) {
    return (
      <Card>
        <CardContent>Event data is missing.</CardContent>
      </Card>
    );
  }

  const onBook = async (
    eventId: number,
    startTime: string,
    endTime: string
  ) => {
    const isTimeSlotAvailable = !bookings.some(
      (booking) =>
        (startTime >= booking.start_time && startTime < booking.end_time) ||
        (endTime > booking.start_time && endTime <= booking.end_time) ||
        (startTime <= booking.start_time && endTime >= booking.end_time)
    );

    const obj: CreateBooking = {
      event_id: eventId,
      start_time: startTime,
      end_time: endTime,
      email,
      name,
    };

    if (isTimeSlotAvailable) {
      const result = await booking_api.createBooking(obj);

      if (result) {
        setAction((prev) => prev + 1);

        return true;
      }

      return false;
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);
    const success = await onBook(event.id, startTime, endTime);
    setLoading(false);

    if (success) {
      setName("");
      setEmail("");
      setStartTime("");
      setEndTime("");
      setError(null);
    } else {
      setError(
        "This time slot overlaps with an existing booking. Please choose another time."
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {new Date(event.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
        <div className="mt-4">
          <h4 className="font-semibold">Current Bookings:</h4>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  {booking.start_time} - {booking.end_time}
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`name-${event.id}`}>Name</Label>
              <Input
                placeholder="ex. John Doe"
                id={`name-${event.id}`}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor={`email-${event.id}`}>Email</Label>
              <Input
                placeholder="ex. example@example.com"
                id={`email-${event.id}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`startTime-${event.id}`}>Start Time</Label>
              <Input
                id={`startTime-${event.id}`}
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor={`endTime-${event.id}`}>End Time</Label>
              <Input
                id={`endTime-${event.id}`}
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading ? true : false}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              "Book Now"
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
