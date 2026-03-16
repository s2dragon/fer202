import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';

const BuffetForm = ({ buffet, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        duration: 90,
        restaurantId: 1,
    });

    useEffect(() => {
        if (buffet) {
            setFormData({
                name: buffet.name || '',
                price: buffet.price || 0,
                duration: buffet.duration || 90,
                restaurantId: buffet.restaurantId || 1,
            });
        }
    }, [buffet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (buffet) {
                // Sửa: dùng PATCH
                await api.patch(`/buffets/${buffet.id}`, formData);
            } else {
                await api.post('/buffets', formData);
            }
            onSuccess();
        } catch (error) {
            alert('Lưu gói buffet thất bại.');
            console.error(error);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{buffet ? 'Sửa gói buffet' : 'Thêm gói buffet mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel controlId="name" label="Tên gói buffet" className="mb-3">
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

                    <FloatingLabel controlId="duration" label="Thời lượng (phút)" className="mb-3">
                        <Form.Control
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
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

export default BuffetForm;