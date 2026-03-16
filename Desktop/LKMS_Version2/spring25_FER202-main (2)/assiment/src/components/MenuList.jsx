import React from "react";

export default function MenuList({ table, menuItems, onAdd }) {
  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>3) Menu (bàn {table.tableNumber})</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {menuItems
          .filter((m) => m.restaurantId === table.restaurantId)
          .map((m) => (
            <div key={m.id} style={itemCard}>
              <div style={{ fontWeight: 700 }}>{m.name}</div>
              <div style={{ color: "#666", marginTop: 4 }}>
                {m.price === 0 ? "Trong buffet" : `${m.price.toLocaleString()}đ`}
              </div>
              <button onClick={() => onAdd(m)} style={{ ...btnPrimary, marginTop: 8 }}>
                + Thêm
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

const card = { border: "1px solid #eee", borderRadius: 12, padding: 14, background: "#fff" };
const itemCard = { border: "1px solid #eee", borderRadius: 12, padding: 12 };
const btnPrimary = { padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" };