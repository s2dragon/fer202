import React from "react";

export default function Totals({ totals }) {
  return (
    <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
      <Row label="Buffet" value={`${totals.buffetTotal.toLocaleString()}đ`} />
      <Row label="Add-on" value={`${totals.addonTotal.toLocaleString()}đ`} />
      <Row label="Gọi thêm" value={`${totals.subTotal.toLocaleString()}đ`} />
      <Row label="Tạm tính" value={`${totals.grandTotal.toLocaleString()}đ`} strong />
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
      <div style={{ color: "#666" }}>{label}</div>
      <div style={{ fontWeight: strong ? 900 : 800 }}>{value}</div>
    </div>
  );
}