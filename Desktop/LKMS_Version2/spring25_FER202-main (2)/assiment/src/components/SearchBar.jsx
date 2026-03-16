import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div style={wrap}>
      <span style={{ fontSize: 14 }}>🔍</span>
      <input
        style={input}
        placeholder="Tìm món… (vd: tokbokki, bò, tôm, coca)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* <img src="/download.png" alt="Download" style={{ width: 14, height: 14, cursor: 'pointer' }} /> */}
    </div>
  );
}

const wrap = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: "10px 12px",
  background: "#fff",
};

const input = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: 14,
};