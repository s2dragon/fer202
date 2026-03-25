import { http as client } from "./client";

export const getBookings = async (restaurantId) => {
  const url = restaurantId ? `/bookings?restaurantId=${restaurantId}` : "/bookings";
  return await client("GET", url);
};

export const createBooking = async (data) => {
  return await client("POST", "/bookings", data);
};

export const updateBookingStatus = async (id, status) => {
  return await client("PATCH", `/bookings/${id}`, { status });
};

export const getTables = async (restaurantId) => {
  const url = restaurantId ? `/tables?restaurantId=${restaurantId}` : "/tables";
  return await client("GET", url);
};
