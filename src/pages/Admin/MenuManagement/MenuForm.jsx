import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';

const MenuForm = ({ item, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        categoryId: '',
        image: '',
        restaurantId: 1,
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (item) {
                // Sửa: dùng PATCH, chỉ gửi những field thay đổi (hoặc toàn bộ nếu form đầy đủ)
                await api.patch(`/menuItems/${item.id}`, formData);
            } else {
                // Tạo mới vẫn dùng POST
                await api.post('/menuItems', formData);
            }
            onSuccess();
        } catch (error) {
            alert('Lưu thất bại');
            console.error(error);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{item ? 'Sửa món ăn' : 'Thêm món ăn mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel controlId="name" label="Tên món" className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="price" label="Giá (VND)" className="mb-3">
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="categoryId" label="Danh mục ID" className="mb-3">
                        <Form.Control
                            type="text"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="image" label="URL ảnh (tùy chọn)" className="mb-3">
                        <Form.Control
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </FloatingLabel>

                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="secondary" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MenuForm;