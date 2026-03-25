import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";

export default function MenuCard({ item, onAdd }) {
  const [bump, setBump] = useState(false);

  const handleAdd = () => {
    setBump(true);
    setTimeout(() => setBump(false), 200);
    onAdd(item);
  };

  return (
    <Card className="shadow-sm border-0 h-100 rounded-4">
      <Card.Img
        variant="top"
        src={item.image || "/menu/placeholder.jpg"}
        alt={item.name}
        onError={(e) => (e.currentTarget.src = "/menu/placeholder.jpg")}
        style={{ height: '140px', objectFit: 'cover' }}
        className="rounded-top-4"
      />
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fs-6 fw-bold mb-1 line-clamp-2" style={{ minHeight: '40px' }}>
          {item.name}
        </Card.Title>
        <Card.Text className="text-muted small mb-3 flex-grow-1">
          {Number(item.price) === 0 ? "Trong buffet" : `${Number(item.price).toLocaleString()}đ`}
        </Card.Text>
        <Button
          variant="dark"
          className="w-100 fw-bold rounded-3 mt-auto"
          onClick={handleAdd}
          style={{ transition: "transform 0.2s", transform: bump ? "scale(1.05)" : "scale(1)" }}
        >
          + Thêm
        </Button>
      </Card.Body>
    </Card>
  );
}