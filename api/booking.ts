import { BASE_URL } from "../constant/config";

interface CreateBooking {
  event_id: number;
  name: string;
  email: string;
  start_time: string;
  end_time: string;
}

export default class BookingApi {
  async createBooking(booking: CreateBooking) {
    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
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
