import React, { useMemo } from "react";
import { Badge } from "react-bootstrap";

export default function FloatingCartBar({ orderItems, total, onOpen }) {
  const count = useMemo(() => orderItems.reduce((s, it) => s + it.quantity, 0), [orderItems]);

  if (count === 0) return null;

  return (
    <div 
      className="position-fixed bottom-0 start-50 translate-middle-x mb-3 bg-dark text-white rounded-pill px-4 py-3 shadow d-flex justify-content-between align-items-center"
      style={{ width: "min(940px, calc(100% - 32px))", zIndex: 1050, cursor: "pointer" }}
      onClick={onOpen}
    >
      <div className="fw-bold">
        Giỏ hàng <Badge bg="light" text="dark" className="ms-1 rounded-pill">{count}</Badge>
      </div>
      <div className="fw-bold fs-5">{total.toLocaleString()}đ</div>
      <div className="bg-white text-dark fw-bold rounded-pill px-3 py-2 small">
        Xem giỏ
      </div>
    </div>
  );
}