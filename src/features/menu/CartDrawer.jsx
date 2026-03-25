import React from "react";
import { Offcanvas, Button, Form, Badge, ListGroup } from "react-bootstrap";
import Totals from "./Totals";

export default function CartDrawer({
  open,
  onClose,
  orderItems,
  onQty,
  totals,
  selectedBuffet,
  guestCount,
  selectedAddons,
  onSubmit,
  onChangeBuffet,
  orderStatus,
  orderNote,
  setOrderNote,
}) {
  return (
    <Offcanvas show={open} onHide={onClose} placement="bottom" style={{ height: 'auto', maxHeight: '85vh', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold">Giỏ hàng</Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body>
        <div className="text-secondary small mb-1">
          Buffet: <span className="fw-bold text-dark">{selectedBuffet?.name || "-"}</span> • Khách: <span className="fw-bold text-dark">{guestCount}</span>
        </div>
        
        {selectedAddons.length > 0 && (
          <div className="text-secondary small mb-3">
            Add-on: {selectedAddons.map((a) => a.name).join(", ")}
          </div>
        )}

        <ListGroup variant="flush" className="mb-3 border-top">
          {orderItems.length === 0 && <ListGroup.Item className="text-muted border-0 px-0">Chưa có món.</ListGroup.Item>}

          {orderItems.map((it) => (
            <ListGroup.Item key={it.id} className="d-flex align-items-center px-0 py-3 border-bottom">
              <div className="flex-grow-1">
                <div className="fw-bold">{it.name}</div>
                <div className="text-muted small">
                  {it.unitPrice === 0 ? "Buffet" : `${Number(it.unitPrice).toLocaleString()}đ`} 
                  <Badge bg="secondary" className="ms-2">{it.status}</Badge>
                </div>
              </div>

              <div className="d-flex align-items-center mx-3">
                <Button variant="light" size="sm" className="fw-bold border" onClick={() => onQty(it.id, -1)} style={{ width: '32px' }}>-</Button>
                <div className="fw-bold mx-2" style={{ minWidth: '20px', textAlign: 'center' }}>{it.quantity}</div>
                <Button variant="light" size="sm" className="fw-bold border" onClick={() => onQty(it.id, +1)} style={{ width: '32px' }}>+</Button>
              </div>

              <div className="fw-bold text-end" style={{ width: '90px' }}>
                {Number(it.lineTotal).toLocaleString()}đ
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Totals totals={totals} />

        <Form.Group className="mt-4 mb-3">
          <Form.Label className="fw-bold small">Ghi chú cho bếp:</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Ví dụ: Không hành, ít cay..."
            className="rounded-3"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="light" className="flex-grow-1 fw-bold border py-2" onClick={onChangeBuffet}>Đổi buffet</Button>
          <Button variant="dark" className="flex-grow-1 fw-bold py-2" onClick={onSubmit}>Gửi bếp</Button>
        </div>

        <div className="text-center text-muted small mt-3">
          Order status: <Badge bg="info" text="dark">{orderStatus || "-"}</Badge>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
