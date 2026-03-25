import React from 'react';

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '8px',
  fontSize: '13px',
  borderBottom: '1px solid #f0f0f0',
};

const itemNameStyle = {
  flex: 1,
};

const itemQtyStyle = {
  width: '40px',
  textAlign: 'center',
  color: '#666',
};

const itemPriceStyle = {
  width: '80px',
  textAlign: 'right',
  fontWeight: '600',
  color: '#11998e',
};

const emptyStyle = {
  textAlign: 'center',
  color: '#999',
  fontSize: '12px',
  padding: '10px 0',
};

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price || 0);

const OrderBill = ({ order, orderItems = [], buffets = [], buffetAddons = [] }) => {
  const buffet = buffets.find(
    (item) => String(item.id) === String(order.buffetId)
  );
  const addons = (order.addonIds || []).map(
    (id) =>
      buffetAddons.find((item) => String(item.id) === String(id))?.name ||
      `Addon ${id}`
  );

  const hasItems = orderItems.length > 0 || order.buffetId || addons.length > 0;

  if (!hasItems) {
    return <div style={emptyStyle}>Không có mục hàng</div>;
  }

  return (
    <div>
      {order.buffetId && (
        <div style={itemRowStyle}>
          <span style={itemNameStyle}>🍱 {buffet?.name || 'Buffet'}</span>
          <span style={itemQtyStyle}>{order.guestCount || 1} khách</span>
          <span style={itemPriceStyle}>{formatPrice(order.buffetTotal)}</span>
        </div>
      )}

      {addons.map((addonName, index) => (
        <div key={`${addonName}-${index}`} style={itemRowStyle}>
          <span style={itemNameStyle}>➕ {addonName}</span>
          <span style={itemQtyStyle}>-</span>
          <span style={itemPriceStyle}>
            {formatPrice((order.addonTotal || 0) / addons.length)}
          </span>
        </div>
      ))}

      {orderItems.map((item) => (
        <div key={item.id} style={itemRowStyle}>
          <span style={itemNameStyle}>{item.name}</span>
          <span style={itemQtyStyle}>x{item.quantity}</span>
          <span style={itemPriceStyle}>{formatPrice(item.lineTotal)}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderBill;
