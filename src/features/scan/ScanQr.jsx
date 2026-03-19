import React from "react";

export default function ScanQr({ qrCode, setQrCode, onScan }) {
  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Quét QR / nhập mã bàn</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          placeholder="vd: R1_T1"
          style={input}
        />
        <button onClick={onScan} style={primary}>
          Vào menu
        </button>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Tip: QR thật sẽ mở link dạng <b>?qr=R1_T1</b> tự vào menu.
      </div>
    </div>
  );
}

const card = { border: "1px solid #eee", borderRadius: 16, padding: 14, background: "#fff" };
const input = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" };
const primary = { padding: "10px 12px", borderRadius: 12, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer", fontWeight: 900 };