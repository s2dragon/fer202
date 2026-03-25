import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

export default function InvoiceModal({ order, table, orderItems, buffets, onClose, onConfirmPaid }) {
  if (!order) return null;

  const buffet = buffets.find(b => String(b.id) === String(order.buffetId));
  const buffetPrice = buffet ? buffet.price : 0;
  const buffetTotal = buffetPrice * (order.guestCount || 0);

  const addonTotal = order.addonTotal || 0;
  const alacarteTotal = orderItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  
  // order.grandTotal could be used, but let's recalculate to be sure
  const subTotal = buffetTotal + addonTotal + alacarteTotal;
  const discount = 0; // future feature
  const grandTotal = subTotal - discount;

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static" className="font-monospace">
      <Modal.Header closeButton className="border-bottom border-secondary border-dashed pb-2">
        <Modal.Title className="w-100 text-center fw-bold fs-4">HÓA ĐƠN THANH TOÁN</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <div className="text-center text-muted mb-4 small">
          Bàn {table?.tableNumber} - {new Date().toLocaleString("vi-VN")}
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-start">
          <div>
            <strong>Loại Buffet:</strong> <br/>
            {buffet ? buffet.name : "Không chọn"} 
            {buffet && <span className="text-secondary small"> ({buffetPrice.toLocaleString()}đ x {order.guestCount} khách)</span>}
          </div>
          <div className="fw-bold">{buffetTotal.toLocaleString()} đ</div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <strong>Phụ thu / Add-ons:</strong>
          <div className="fw-bold">{addonTotal.toLocaleString()} đ</div>
        </div>

        <div className="mb-3 border-bottom border-secondary border-dashed pb-3">
          <strong>Món gọi thêm (A la carte & Đồ ăn/uống thêm):</strong>
          <Table borderless size="sm" className="mt-2 mb-0">
            <tbody>
              {orderItems.map(item => (
                <tr key={item.id}>
                  <td className="ps-0 text-truncate" style={{ maxWidth: '200px' }}>{item.quantity}x {item.name}</td>
                  <td className="pe-0 text-end">{(item.lineTotal || 0).toLocaleString()} đ</td>
                </tr>
              ))}
              {orderItems.length === 0 && <tr><td colSpan={2} className="text-muted ps-0">- Không có -</td></tr>}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>Tạm tính:</span>
          <span>{subTotal.toLocaleString()} đ</span>
        </div>
        <div className="d-flex justify-content-between mb-3 text-success">
          <span>Giảm giá:</span>
          <span>-{discount.toLocaleString()} đ</span>
        </div>
        
        <div className="d-flex justify-content-between mt-3 pt-3 border-top border-dark border-2 fs-5 fw-bold">
          <span>Tổng cộng:</span>
          <span className="text-danger">{grandTotal.toLocaleString()} đ</span>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4 pt-0 d-flex gap-2">
        <Button variant="light" className="flex-grow-1 fw-bold border" onClick={onClose}>Đóng</Button>
        <Button variant="success" className="flex-grow-1 fw-bold" onClick={() => onConfirmPaid(grandTotal)}>Xác nhận Thu tiền</Button>
      </Modal.Footer>
    </Modal>
  );
}
