import React, { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../api/adminApi";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

export default function MenuManager({ restaurantId }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      const menus = await getItems("menuItems");
      const cats = await getItems("menuCategories");
      setItems(menus.filter(m => m.restaurantId === restaurantId));
      setCategories(cats);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.price === "" || !form.categoryId) {
      return alert("Vui lòng điền đầy đủ tên món, giá và chọn danh mục!");
    }
    
    if (isNaN(Number(form.price))) {
      return alert("Giá tiền phải là một con số hợp lệ!");
    }
    
    const payload = {
      restaurantId,
      categoryId: Number(form.categoryId),
      name: form.name,
      price: Number(form.price),
      image: form.image || "/menu/placeholder.jpg"
    };

    try {
      if (editingId) {
        await updateItem("menuItems", editingId, payload);
        alert("Cập nhật món ăn thành công!");
      } else {
        await createItem("menuItems", payload);
        alert("Thêm món ăn mới thành công!");
      }
      setForm({ name: "", price: "", categoryId: "", image: "" });
      setEditingId(null);
      loadData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, price: t.price, categoryId: t.categoryId, image: t.image });
    setEditingId(t.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa món này?")) return;
    try {
      await deleteItem("menuItems", id);
      loadData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Quản lý Thực đơn (Menu Items)</h3>
      <Form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-4 shadow-sm border">
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Tên món</Form.Label>
              <Form.Control 
                placeholder="VD: Cơm rang..." 
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
                placeholder="VD: 50000" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Danh mục</Form.Label>
              <Form.Select 
                value={form.categoryId} 
                onChange={e => setForm({...form, categoryId: e.target.value})}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
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
            <th className="py-3">Tên món</th>
            <th className="py-3">Danh mục</th>
            <th className="py-3">Giá bán</th>
            <th className="py-3 text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            return (
              <tr key={t.id}>
                <td className="fw-bold">{t.name}</td>
                <td className="text-secondary">{cat ? cat.name : ""}</td>
                <td>{Number(t.price).toLocaleString()} đ</td>
                <td className="text-end">
                  <Button variant="outline-primary" size="sm" className="me-2 fw-bold" onClick={() => handleEdit(t)}>Sửa</Button>
                  <Button variant="outline-danger" size="sm" className="fw-bold" onClick={() => handleDelete(t.id)}>Xóa</Button>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">Chưa có dữ liệu thực đơn.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
