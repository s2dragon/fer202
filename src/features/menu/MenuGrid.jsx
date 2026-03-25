import React from "react";
import { Row, Col } from "react-bootstrap";
import MenuCard from "./MenuCard";

export default function MenuGrid({ items, onAdd }) {
  return (
    <Row className="g-3">
      {items.map((it) => (
        <Col xs={6} md={4} lg={3} key={it.id}>
          <MenuCard item={it} onAdd={onAdd} />
        </Col>
      ))}
    </Row>
  );
}