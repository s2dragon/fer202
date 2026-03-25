import React from "react";
import { Button } from "react-bootstrap";

export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: "none" }}>
      <Button
        key="all"
        variant={activeId === null ? "dark" : "outline-secondary"}
        className="rounded-pill px-4"
        style={{ whiteSpace: "nowrap" }}
        onClick={() => onChange(null)}
      >
        Tất cả
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeId === Number(cat.id) ? "dark" : "outline-secondary"}
          className="rounded-pill px-4"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}