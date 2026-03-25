import { http as client } from "./client";

export const getTablesWithOrders = async (restaurantId) => {
  const tables = await client("GET", `/tables?restaurantId=${restaurantId}`);
  const ordersRes = await client("GET", `/orders?restaurantId=${restaurantId}`);
  const activeOrders = ordersRes.filter(o => o.status !== "paid" && o.status !== "closed");
  const buffetsRes = await client("GET", `/buffets?restaurantId=${restaurantId}`);
  
  return { tables, activeOrders, buffets: buffetsRes };
};

export const getOrderItemsForCheckout = async (orderId) => {
  return await client("GET", `/orderItems?orderId=${orderId}`);
};

export const checkoutOrder = async (orderId, totalPaid) => {
  return await client("PATCH", `/orders/${orderId}`, { 
    status: "paid", 
    updatedAt: new Date().toISOString() 
  });
};

export const resetTable = async (tableId) => {
  return await client("PATCH", `/tables/${tableId}`, { status: "available" });
};
