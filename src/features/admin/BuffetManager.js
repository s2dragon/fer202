import React, { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../api/adminApi";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

export default function BuffetManager({ restaurantId }) {
  const [buffets, setBuffets] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", duration: "" });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      const data = await getItems("buffets");
      setBuffets(data.filter(b => b.restaurantId === restaurantId));
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.duration) return alert("Vui lòng điền đủ");
    
    const payload = {
      restaurantId,
      name: form.name,
      price: Number(form.price),
      duration: Number(form.duration)
    };

    try {
      if (editingId) {
        await updateItem("buffets", editingId, payload);
      } else {
        await createItem("buffets", payload);
      }
      setForm({ name: "", price: "", duration: "" });
      setEditingId(null);
      loadData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, price: t.price, duration: t.duration });
    setEditingId(t.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa buffet này?")) return;
    try {
      await deleteItem("buffets", id);
      loadData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Quản lý Gói Buffet</h3>
      <Form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-4 shadow-sm border">
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Tên Gói Buffet</Form.Label>
              <Form.Control 
                placeholder="VD: Buffet Tiêu chuẩn..." 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Giá (VND)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="VD: 159000" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Thời gian (phút)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="VD: 120" 
                value={form.duration} 
                onChange={e => setForm({...form, duration: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex gap-2">
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
            <th className="py-3">Tên gói</th>
            <th className="py-3">Giá</th>
            <th className="py-3">Thời lượng</th>
            <th className="py-3 text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {buffets.map(t => (
            <tr key={t.id}>
              <td className="fw-bold">{t.name}</td>
              <td className="text-danger fw-bold">{Number(t.price).toLocaleString()} đ</td>
              <td>{t.duration} phút</td>
              <td className="text-end">
                <Button variant="outline-primary" size="sm" className="me-2 fw-bold" onClick={() => handleEdit(t)}>Sửa</Button>
                <Button variant="outline-danger" size="sm" className="fw-bold" onClick={() => handleDelete(t.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
          {buffets.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">Chưa có dữ liệu Buffet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
