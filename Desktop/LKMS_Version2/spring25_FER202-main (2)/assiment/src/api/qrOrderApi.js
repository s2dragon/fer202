import { http } from "./client";

export async function getTableByQr(qrCode) {
  const tables = await http("GET", `/tables?qrCode=${encodeURIComponent(qrCode)}`);
  return tables[0] ?? null;
}

export async function getBuffets(restaurantId) {
  return http("GET", `/buffets?restaurantId=${restaurantId}`);
}

export async function getBuffetAddons(restaurantId) {
  return http("GET", `/buffetAddons?restaurantId=${restaurantId}`);
}

export async function getMenuItems(restaurantId) {
  return http("GET", `/menuItems?restaurantId=${restaurantId}`);
}

export async function getMenuCategories() {
  return http("GET", `/menuCategories`);
}

export async function getActiveOrderByTable(tableId) {
  const orders = await http("GET", `/orders?tableId=${tableId}&status=ordering`);
  return orders[0] ?? null;
}

export async function createOrder(payload) {
  return http("POST", `/orders`, payload);
}

export async function patchOrder(orderId, payload) {
  return http("PATCH", `/orders/${orderId}`, payload);
}

export async function getOrderItems(orderId) {
  return http("GET", `/orderItems?orderId=${orderId}`);
}

export async function addOrderItem(payload) {
  return http("POST", `/orderItems`, payload);
}

export async function patchOrderItem(id, payload) {
  return http("PATCH", `/orderItems/${id}`, payload);
}

export async function deleteOrderItem(id) {
  return http("DELETE", `/orderItems/${id}`);
}

export function calcTotals({ buffet, guestCount, addons, orderItems }) {
  const buffetTotal = buffet ? buffet.price * (guestCount || 0) : 0;
  const addonTotal = (addons || []).reduce((s, a) => s + a.price, 0);
  const subTotal = (orderItems || []).reduce((s, it) => s + (it.lineTotal || 0), 0);
  const grandTotal = buffetTotal + addonTotal + subTotal;
  return { buffetTotal, addonTotal, subTotal, grandTotal };
}