import React, { useMemo } from "react";

export default function FloatingCartBar({ orderItems, total, onOpen }) {
  const count = useMemo(() => orderItems.reduce((s, it) => s + it.quantity, 0), [orderItems]);

  if (count === 0) return null;

  return (
    <div style={wrap} onClick={onOpen}>
      <div style={{ fontWeight: 900 }}>🛒 {count} món</div>
      <div style={{ fontWeight: 900 }}>{total.toLocaleString()}đ</div>
      <div style={cta}>Xem giỏ</div>
    </div>
  );
}

const wrap = {
  position: "fixed",
  left: "50%",
  bottom: 16,
  transform: "translateX(-50%)",
  width: "min(940px, calc(100% - 24px))",
  background: "#111",
  color: "#fff",
  borderRadius: 16,
  padding: "12px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
  cursor: "pointer",
  zIndex: 50,
};

const cta = {
  background: "#fff",
  color: "#111",
  padding: "6px 10px",
  borderRadius: 12,
  fontWeight: 900,
};