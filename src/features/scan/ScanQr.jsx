import React from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";

export default function ScanQr({ qrCode, setQrCode, onScan }) {
  return (
    <Card className="shadow-sm border-0 mb-4 rounded-4">
      <Card.Body className="p-4">
        <h4 className="fw-bold mb-3">Quét QR / nhập mã bàn</h4>
        <InputGroup className="mb-3">
          <Form.Control
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            placeholder="vd: R1_T1"
            className="rounded-start-3 py-2"
          />
          <Button variant="dark" onClick={onScan} className="fw-bold px-4 rounded-end-3">
            Vào menu
          </Button>
        </InputGroup>
        <div className="text-muted small">
          Tip: QR thật sẽ mở link dạng <b>?qr=R1_T1</b> tự vào menu.
        </div>
      </Card.Body>
    </Card>
  );
}