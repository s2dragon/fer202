import { http } from './http';

export const getTables = () => http('GET', '/tables');
export const patchTable = (tableId, body) => http('PATCH', `/tables/${tableId}`, body);

export const getOrders = (status = 'pending', tableId = null) => {
  const params = new URLSearchParams({ status });

  if (tableId !== null && tableId !== undefined) {
    params.append('tableId', tableId);
  }

  return http('GET', `/orders?${params.toString()}`);
};

export const getOrderItems = (orderId) => http('GET', `/orderItems?orderId=${orderId}`);
export const patchOrder = (orderId, body) => http('PATCH', `/orders/${orderId}`, body);
export const getBuffets = () => http('GET', '/buffets');
export const getBuffetAddons = () => http('GET', '/buffetAddons');
