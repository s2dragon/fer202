import React, { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../api/adminApi";
import { Table, Button, Form, Row, Col, Badge } from "react-bootstrap";

export default function TableManager({ restaurantId }) {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableNumber: "", capacity: "" });
  const [editingId, setEditingId] = useState(null);

  const loadTables = async () => {
    try {
      const data = await getItems("tables");
      setTables(data.filter(t => t.restaurantId === restaurantId));
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => { loadTables(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tableNumber || !form.capacity) return alert("Vui lòng điền đủ");
    
    // Auto generate QR logic
    const qrCode = `R${restaurantId}_T${form.tableNumber}`;

    const payload = {
      restaurantId,
      tableNumber: Number(form.tableNumber),
      capacity: Number(form.capacity),
      qrCode,
      status: "available"
    };

    try {
      if (editingId) {
        await updateItem("tables", editingId, payload);
      } else {
        await createItem("tables", payload);
      }
      setForm({ tableNumber: "", capacity: "" });
      setEditingId(null);
      loadTables();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  const handleEdit = (t) => {
    setForm({ tableNumber: t.tableNumber, capacity: t.capacity });
    setEditingId(t.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bàn này?")) return;
    try {
      await deleteItem("tables", id);
      loadTables();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Quản lý Bàn và Mã QR</h3>
      <Form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-4 shadow-sm border">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Số bàn</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="VD: 1, 2, 3..." 
                value={form.tableNumber} 
                onChange={e => setForm({...form, tableNumber: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Sức chứa (người)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="VD: 2, 4, 8..." 
                value={form.capacity} 
                onChange={e => setForm({...form, capacity: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex gap-2">
            <Button variant={editingId ? "success" : "danger"} type="submit" className="fw-bold w-100">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            {editingId && (
              <Button variant="outline-secondary" type="button" className="fw-bold" onClick={() => setEditingId(null)}>
                Hủy
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      <Table responsive hover className="align-middle border">
        <thead className="table-light">
          <tr>
            <th className="py-3">Số bàn</th>
            <th className="py-3">Sức chứa</th>
            <th className="py-3">Mã QR Code</th>
            <th className="py-3 text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tables.map(t => (
            <tr key={t.id}>
              <td className="fw-bold">Bàn {t.tableNumber}</td>
              <td>{t.capacity} người</td>
              <td><Badge bg="dark" className="fs-6 px-3 py-2 rounded-pill font-monospace">{t.qrCode}</Badge></td>
              <td className="text-end">
                <Button variant="outline-primary" size="sm" className="me-2 fw-bold" onClick={() => handleEdit(t)}>Sửa</Button>
                <Button variant="outline-danger" size="sm" className="fw-bold" onClick={() => handleDelete(t.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
          {tables.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">Chưa có dữ liệu bàn.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
