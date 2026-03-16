import React, { useState } from "react";

export default function MenuCard({ item, onAdd }) {
  const [bump, setBump] = useState(false);

  const handleAdd = () => {
    setBump(true);
    setTimeout(() => setBump(false), 200);
    onAdd(item);
  };

  return (
    <div style={card}>
      <img
        src={item.image || "https://via.placeholder.com/150x130?text=No+Image"}
        alt={item.name}
        style={img}
        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150x130?text=No+Image")}
      />

      <div style={name}>{item.name}</div>

      <div style={price}>
        {Number(item.price) === 0 ? "Trong buffet" : `${Number(item.price).toLocaleString()}đ`}
      </div>

      <button
        onClick={handleAdd}
        style={{
          ...btn,
          transform: bump ? "scale(1.06)" : "scale(1)",
        }}
      >
        + Thêm
      </button>
    </div>
  );
}

const card = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 10,
  background: "#fff",
  boxShadow: "0 1px 10px rgba(0,0,0,0.03)",
};

const img = {
  width: "100%",
  height: 130,
  objectFit: "cover",
  borderRadius: 12,
  background: "#f2f2f2",
};

const name = { marginTop: 8, fontWeight: 900, fontSize: 14 };
const price = { marginTop: 3, color: "#666", fontSize: 13 };

const btn = {
  marginTop: 8,
  width: "100%",
  padding: 10,
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
  transition: "transform 0.2s",
};