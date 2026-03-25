import React from "react";
import { Card, Form, Row, Col, Button, Badge } from "react-bootstrap";

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
    <Card className="shadow-sm border-0 mb-4 rounded-4">
      <Card.Body className="p-4">
        <h4 className="fw-bold mb-4">Chọn buffet cho bàn {table.tableNumber}</h4>

        <Row className="g-3 mb-4">
          <Col md={8}>
            <Form.Group>
              <Form.Label className="fw-bold text-muted small">Gói buffet</Form.Label>
              <Form.Select 
                value={selectedBuffetId} 
                onChange={(e) => setSelectedBuffetId(e.target.value)}
                className="py-2"
              >
                <option value="">-- Chọn gói buffet --</option>
                {buffets.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name} ({b.price.toLocaleString()}đ / người • {b.duration}p)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold text-muted small">Số khách</Form.Label>
              <Form.Control 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                value={guestCount} 
                onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value.replace(/[^0-9]/g, '')) : "")} 
                className="py-2"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mb-4">
          <div className="fw-bold text-muted small mb-2">Add-on</div>
          <div className="d-flex flex-wrap gap-2">
            {addons.map((a) => (
              <Form.Check
                key={a.id}
                type="checkbox"
                id={`addon-${a.id}`}
                className="mb-0"
              >
                <Form.Check.Input 
                  type="checkbox" 
                  checked={selectedAddonIds.includes(a.id)}
                  onChange={(e) =>
                    setSelectedAddonIds((prev) =>
                      e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)
                    )
                  }
                  className="mt-1"
                />
                <Form.Check.Label className="ms-2 d-flex align-items-center gap-2 px-2 py-1 bg-light border rounded-pill" style={{ cursor: "pointer" }}>
                  <span className="fw-bold">{a.name}</span>
                  <Badge bg="secondary" className="rounded-pill">+{a.price.toLocaleString()}đ</Badge>
                </Form.Check.Label>
              </Form.Check>
            ))}
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <Button variant="light" className="flex-grow-1 py-2 fw-bold border" onClick={onBack}>
            Quay lại
          </Button>
          <Button variant="dark" className="flex-grow-1 py-2 fw-bold" onClick={onConfirm}>
            Xác nhận
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}