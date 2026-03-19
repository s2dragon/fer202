import React from "react";
import Totals from "./Totals";

export default function Cart({
  order,
  selectedBuffet,
  guestCount,
  selectedAddons,
  orderItems,
  onQty,
  onChangeBuffet,
  onSubmit,
  totals,
}) {
  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>🧺 Giỏ hàng</h3>

      <div style={{ color: "#666", marginBottom: 6 }}>
        Buffet: <b>{selectedBuffet?.name || "-"}</b> • Khách: <b>{guestCount}</b>
      </div>

      {selectedAddons.length > 0 && (
        <div style={{ color: "#666", marginBottom: 10 }}>
          Add-on: {selectedAddons.map((a) => a.name).join(", ")}
        </div>
      )}

      <div style={{ borderTop: "1px solid #eee", paddingTop: 8 }}>
        {orderItems.length === 0 && <div style={{ color: "#888" }}>Chưa có món nào.</div>}
        {orderItems.map((it) => (
          <div key={it.id} style={cartRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div style={{ color: "#666", fontSize: 12 }}>
                {it.unitPrice === 0 ? "Buffet" : `${it.unitPrice.toLocaleString()}đ`} • {it.status}
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => onQty(it.id, -1)} style={btnSmall}>-</button>
              <b>{it.quantity}</b>
              <button onClick={() => onQty(it.id, +1)} style={btnSmall}>+</button>
            </div>

            <div style={{ width: 92, textAlign: "right" }}>
              {it.lineTotal.toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      <Totals totals={totals} />

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={onChangeBuffet} style={btn}>Đổi buffet</button>
        <button onClick={onSubmit} style={btnPrimary}>Gửi bếp</button>
      </div>

      {order?.status && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
          Order status hiện tại: <b>{order.status}</b>
        </div>
      )}
    </div>
  );
}

const card = { border: "1px solid #eee", borderRadius: 12, padding: 14, background: "#fff" };
const cartRow = { display: "flex", gap: 10, alignItems: "center", padding: "8px 0" };
const btn = { padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "#f7f7f7", cursor: "pointer" };
const btnPrimary = { padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" };
const btnSmall = { width: 30, height: 28, borderRadius: 8, border: "1px solid #ddd", background: "#f7f7f7", cursor: "pointer" };