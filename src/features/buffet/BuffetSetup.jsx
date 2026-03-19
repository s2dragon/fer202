import React from "react";

export default function BuffetSetup({
  table,
  buffets,
  addons,
  selectedBuffetId,
  setSelectedBuffetId,
  guestCount,
  setGuestCount,
  selectedAddonIds,
  setSelectedAddonIds,
  onBack,
  onConfirm,
}) {
  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Chọn buffet cho bàn {table.tableNumber}</h3>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 300, flex: 1 }}>
          <div style={label}>Gói buffet</div>
          <select value={selectedBuffetId} onChange={(e) => setSelectedBuffetId(e.target.value)} style={input}>
            <option value="">-- Chọn buffet --</option>
            {buffets.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name} ({b.price.toLocaleString()}đ / người • {b.duration}p)
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: 140 }}>
          <div style={label}>Số khách</div>
          <input type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} style={input} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={label}>Add-on</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {addons.map((a) => (
            <label key={a.id} style={chip}>
              <input
                type="checkbox"
                checked={selectedAddonIds.includes(a.id)}
                onChange={(e) =>
                  setSelectedAddonIds((prev) =>
                    e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)
                  )
                }
              />
              <span style={{ fontWeight: 900 }}>{a.name}</span>
              <span style={{ color: "#666" }}>+{a.price.toLocaleString()}đ</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button style={ghost} onClick={onBack}>Quay lại</button>
        <button style={primary} onClick={onConfirm}>Xác nhận</button>
      </div>
    </div>
  );
}

const card = { border: "1px solid #eee", borderRadius: 16, padding: 14, background: "#fff" };
const label = { fontSize: 12, color: "#777", marginBottom: 6, fontWeight: 800 };
const input = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" };
const chip = { display: "flex", gap: 8, alignItems: "center", border: "1px solid #eee", borderRadius: 999, padding: "8px 10px", background: "#fafafa" };
const ghost = { flex: 1, padding: 12, borderRadius: 14, border: "1px solid #ddd", background: "#f7f7f7", cursor: "pointer", fontWeight: 900 };
const primary = { flex: 1, padding: 12, borderRadius: 14, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer", fontWeight: 900 };