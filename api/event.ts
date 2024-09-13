import { BASE_URL } from "../constant/config";

interface CreateEvent {
  title: string;
  description: string;
  date: string;
}

export default class EventApi {
  async getEvents() {
    try {
      const response = await fetch(`${BASE_URL}/events`);

      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getBookingByEvent(event_id: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/bookings-by-event-id/${event_id}`
      );

      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async createEvent(event: CreateEvent) {
    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
        redirect: "follow",
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        return true;
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e) {
      console.log(e);
    }
  }
}
