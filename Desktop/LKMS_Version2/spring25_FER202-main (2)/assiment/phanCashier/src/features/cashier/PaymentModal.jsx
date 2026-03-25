import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { patchOrder, patchTable } from '../../api/ApiService';
import OrderBill from './OrderBill';

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '30px',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#11998e',
  marginBottom: '20px',
  textAlign: 'center',
};

const sectionStyle = {
  marginBottom: '25px',
  paddingBottom: '15px',
  borderBottom: '1px solid #e0e0e0',
};

const sectionTitleStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '12px',
  textTransform: 'uppercase',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#555',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '8px',
  fontSize: '14px',
  color: '#333',
};

const summaryValueStyle = {
  fontWeight: 'bold',
  color: '#11998e',
  fontSize: '16px',
};

const totalRowStyle = {
  ...summaryRowStyle,
  paddingTop: '10px',
  borderTop: '2px solid #11998e',
  fontSize: '18px',
};

const totalValueStyle = {
  ...summaryValueStyle,
  fontSize: '20px',
  color: '#38ef7d',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '12px',
  marginTop: '25px',
  flexWrap: 'wrap',
};

const buttonStyle = {
  flex: '1 1 180px',
  minWidth: '180px',
  padding: '12px',
  fontSize: '14px',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const confirmBtnStyle = {
  ...buttonStyle,
  backgroundColor: '#38ef7d',
  color: 'white',
};

const cancelBtnStyle = {
  ...buttonStyle,
  backgroundColor: '#e0e0e0',
  color: '#333',
};

const paymentMethods = [
  { value: 'cash', label: '💵 Tiền mặt' },
  { value: 'card', label: '💳 Thẻ (Card)' },
  { value: 'qr', label: '📱 QR' },
  { value: 'transfer', label: '🏦 Chuyển khoản' },
];

const PaymentModal = ({
  order,
  onClose,
  onSuccess,
  buffets = [],
  buffetAddons = [],
  orderItems = [],
}) => {
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState('vnd');
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const baseTotal = useMemo(() => {
    const buffetTotal = Number(order?.buffetTotal) || 0;
    const addonTotal = Number(order?.addonTotal) || 0;
    const itemsTotal = orderItems.reduce(
      (sum, item) => sum + (Number(item.lineTotal) || 0),
      0
    );

    return buffetTotal + addonTotal + itemsTotal || Number(order?.grandTotal) || 0;
  }, [order, orderItems]);

  const discountAmount = useMemo(() => {
    if (discountType === 'percent') {
      return Math.min(baseTotal, Math.floor((baseTotal * discountValue) / 100));
    }

    return Math.min(baseTotal, discountValue);
  }, [baseTotal, discountType, discountValue]);

  const finalTotal = baseTotal - discountAmount;
  const changeDue = Math.max(0, paymentReceived - finalTotal);

  const handleDiscountChange = (value) => {
    const parsedValue = Math.max(0, parseInt(value, 10) || 0);
    const maxValue = discountType === 'percent' ? 100 : baseTotal;
    setDiscountValue(Math.min(parsedValue, maxValue));
  };

  const handlePayment = async () => {
    if (paymentReceived < finalTotal) {
      toast.error('Tiền khách đưa chưa đủ.');
      return;
    }

    try {
      setLoading(true);

      const updatedOrder = await patchOrder(order.id, {
        status: 'completed',
        paymentMethod,
        discount: discountAmount,
        discountType,
        discountPercent: discountType === 'percent' ? discountValue : 0,
        actualTotal: finalTotal,
        grandTotal: baseTotal,
        paidAt: new Date().toISOString(),
        paidAmount: paymentReceived,
        changeDue,
      });

      if (order.tableId) {
        await patchTable(order.tableId, { status: 'available' });
      }

      onSuccess(updatedOrder);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Lỗi khi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(event) => event.stopPropagation()}>
        <h2 style={titleStyle}>💰 Thanh Toán</h2>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Chi tiết hóa đơn</div>
          <OrderBill
            order={order}
            orderItems={orderItems}
            buffets={buffets}
            buffetAddons={buffetAddons}
          />
        </div>

        <div style={sectionStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Loại chiết khấu</label>
            <select
              style={selectStyle}
              value={discountType}
              onChange={(event) => {
                setDiscountType(event.target.value);
                setDiscountValue(0);
              }}
            >
              <option value="vnd">Giá tiền (VND)</option>
              <option value="percent">Phần trăm (%)</option>
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              {discountType === 'percent' ? 'Chiết khấu (%)' : 'Chiết khấu (VND)'}
            </label>
            <input
              type="number"
              style={inputStyle}
              value={discountValue}
              onChange={(event) => handleDiscountChange(event.target.value)}
              placeholder="0"
              min="0"
              max={discountType === 'percent' ? '100' : baseTotal}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phương thức thanh toán</label>
            <select
              style={selectStyle}
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Tiền khách đưa (VND)</label>
            <input
              type="number"
              style={inputStyle}
              value={paymentReceived}
              onChange={(event) =>
                setPaymentReceived(Math.max(0, parseInt(event.target.value, 10) || 0))
              }
              placeholder="0"
              min="0"
            />
          </div>

          <div style={summaryRowStyle}>
            <span>Tiền thừa:</span>
            <span style={{ ...summaryValueStyle, color: changeDue > 0 ? '#2e7d32' : '#d32f2f' }}>
              {changeDue.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={summaryRowStyle}>
            <span>Tổng cộng:</span>
            <span style={summaryValueStyle}>{baseTotal.toLocaleString('vi-VN')} ₫</span>
          </div>

          {discountAmount > 0 && (
            <div style={summaryRowStyle}>
              <span>Chiết khấu:</span>
              <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                -{discountAmount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          )}

          <div style={totalRowStyle}>
            <span>Cần thanh toán:</span>
            <span style={totalValueStyle}>{finalTotal.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>

        <div style={buttonGroupStyle}>
          <button style={cancelBtnStyle} onClick={onClose}>
            Hủy
          </button>

          <button
            style={confirmBtnStyle}
            onClick={handlePayment}
            disabled={loading || paymentReceived < finalTotal}
          >
            {loading ? '⏳ Đang xử lý...' : '✓ Xác nhận thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
