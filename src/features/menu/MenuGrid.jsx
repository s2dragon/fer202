import React from "react";
import MenuCard from "./MenuCard";

export default function MenuGrid({ items, onAdd }) {
  return (
    <div style={grid}>
      {items.map((it) => (
        <MenuCard key={it.id} item={it} onAdd={onAdd} />
      ))}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};