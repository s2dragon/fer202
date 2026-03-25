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

  useEffect(() => { 
    loadData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return alert("Vui lòng chọn một file hình ảnh!");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality to ensure it fits json-server limits (100KB)
          let compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          
          // Fallback stronger compression if still large
          if (compressedBase64.length > 90000) {
             compressedBase64 = canvas.toDataURL("image/jpeg", 0.5);
          }

          setForm({ ...form, image: compressedBase64 });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Quản lý Thực đơn (Menu Items)</h3>
      <Form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-4 shadow-sm border">
        <Row className="g-3 align-items-end">
          <Col md={6} lg={3}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Tên món</Form.Label>
              <Form.Control 
                placeholder="VD: Cơm rang..." 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </Form.Group>
          </Col>
          <Col md={6} lg={2}>
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
          <Col md={6} lg={3}>
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
          <Col md={6} lg={4}>
            <Form.Group>
              <Form.Label className="fw-bold small text-muted">Ảnh món ăn (Từ máy)</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {form.image && form.image !== "/menu/placeholder.jpg" && (
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    className="rounded shadow-sm" 
                    style={{ width: "38px", height: "38px", objectFit: "cover" }} 
                  />
                )}
              </div>
            </Form.Group>
          </Col>
          <Col md={12} className="d-flex gap-2 justify-content-end mt-4">
            {editingId && (
              <Button variant="outline-secondary" type="button" className="fw-bold px-4" onClick={() => setEditingId(null)}>
                Hủy
              </Button>
            )}
            <Button variant={editingId ? "success" : "danger"} type="submit" className="fw-bold px-4">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Col>
        </Row>
      </Form>

      <Table responsive hover className="align-middle border">
        <thead className="table-light">
          <tr>
            <th className="py-3">Hình ảnh</th>
            <th className="py-3">Tên món</th>
            <th className="py-3">Danh mục</th>
            <th className="py-3">Giá bán</th>
            <th className="py-3 text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => {
            const cat = categories.find(c => String(c.id) === String(t.categoryId));
            return (
              <tr key={t.id}>
                <td>
                  <img src={t.image} alt={t.name} className="rounded shadow-sm" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                </td>
                <td className="fw-bold text-primary">{t.name}</td>
                <td>{cat ? cat.name : "N/A"}</td>
                <td className="fw-medium text-danger">{t.price.toLocaleString("vi-VN")} đ</td>
                <td className="text-end">
                  <Button variant="outline-primary" size="sm" className="me-2 fw-bold" onClick={() => handleEdit(t)}>Sửa</Button>
                  <Button variant="outline-danger" size="sm" className="fw-bold" onClick={() => handleDelete(t.id)}>Xóa</Button>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-muted">Chưa có dữ liệu món ăn.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
