import React from "react";
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
}) {
  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Giỏ hàng</div>
          <button style={xBtn} onClick={onClose}>
            Đóng
          </button>
        </div>

        <div style={{ color: "#666", marginTop: 6 }}>
          Buffet: <b>{selectedBuffet?.name || "-"}</b> • Khách: <b>{guestCount}</b>
        </div>
        {selectedAddons.length > 0 && (
          <div style={{ color: "#666", marginTop: 4 }}>
            Add-on: {selectedAddons.map((a) => a.name).join(", ")}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          {orderItems.length === 0 && <div style={{ color: "#999" }}>Chưa có món.</div>}

          {orderItems.map((it) => (
            <div key={it.id} style={row}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900 }}>{it.name}</div>
                <div style={{ color: "#666", fontSize: 12 }}>
                  {it.unitPrice === 0 ? "Buffet" : `${it.unitPrice.toLocaleString()}đ`} • {it.status}
                </div>
              </div>

              <div style={qty}>
                <button style={qtyBtn} onClick={() => onQty(it.id, -1)}>
                  -
                </button>
                <div style={{ fontWeight: 900 }}>{it.quantity}</div>
                <button style={qtyBtn} onClick={() => onQty(it.id, +1)}>
                  +
                </button>
              </div>

              <div style={{ width: 90, textAlign: "right", fontWeight: 900 }}>
                {it.lineTotal.toLocaleString()}đ
              </div>
            </div>
          ))}
        </div>

        <Totals totals={totals} />

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button style={ghost} onClick={onChangeBuffet}>Đổi buffet</button>
          <button style={primary} onClick={onSubmit}>Gửi bếp</button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
          Order status: <b>{orderStatus || "-"}</b>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  zIndex: 60,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
};

const drawer = {
  width: "min(940px, 100%)",
  background: "#fff",
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
  padding: 14,
  maxHeight: "80vh",
  overflow: "auto",
};

const header = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const xBtn = { border: "1px solid #ddd", background: "#f7f7f7", borderRadius: 10, padding: "6px 10px", cursor: "pointer" };

const row = { display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f1f1" };
const qty = { display: "flex", gap: 8, alignItems: "center" };
const qtyBtn = { width: 28, height: 28, borderRadius: 10, border: "1px solid #ddd", background: "#f7f7f7", cursor: "pointer", fontWeight: 900 };

const ghost = { flex: 1, padding: 12, borderRadius: 14, border: "1px solid #ddd", background: "#f7f7f7", cursor: "pointer", fontWeight: 900 };
const primary = { flex: 1, padding: 12, borderRadius: 14, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer", fontWeight: 900 };