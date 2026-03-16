import React from "react";

export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div style={tabs}>
      <button
        key="all"
        style={activeId === null ? { ...tab, ...active } : tab}
        onClick={() => onChange(null)}
      >
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          style={activeId === Number(cat.id) ? { ...tab, ...active } : tab}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

const tabs = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 8,
};

const tab = {
  padding: "8px 16px",
  border: "1px solid #ddd",
  borderRadius: 20,
  background: "#fff",
  fontSize: 14,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const active = {
  background: "#007bff",
  color: "#fff",
  borderColor: "#007bff",
};