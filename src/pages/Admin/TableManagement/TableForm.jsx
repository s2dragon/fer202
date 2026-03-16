import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';

const TableForm = ({ table, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: '',
        status: 'available',
        restaurantId: 1,
        qrCode: '',
    });

    useEffect(() => {
        if (table) {
            setFormData({
                tableNumber: table.tableNumber || '',
                capacity: table.capacity || '',
                status: table.status || 'available',
                restaurantId: table.restaurantId || 1,
                qrCode: table.qrCode || '',
            });
        }
    }, [table]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const generateQRCode = () => {
        if (!formData.tableNumber) return '';
        return `R1_T${formData.tableNumber}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const qr = generateQRCode();
        if (!qr) {
            alert('Vui lòng nhập số bàn hợp lệ.');
            return;
        }

        const dataToSend = { ...formData, qrCode: qr };

        try {
            if (table) {
                // Sửa: dùng PATCH
                await api.patch(`/tables/${table.id}`, dataToSend);
            } else {
                await api.post('/tables', dataToSend);
            }
            onSuccess();
        } catch (error) {
            alert('Lưu bàn thất bại.');
            console.error(error);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{table ? 'Sửa thông tin bàn' : 'Thêm bàn mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel controlId="tableNumber" label="Số bàn" className="mb-3">
                        <Form.Control
                            type="number"
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="capacity" label="Sức chứa (người)" className="mb-3">
                        <Form.Control
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <Form.Group className="mb-3">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="available">Trống</option>
                            <option value="occupied">Đang sử dụng</option>
                        </Form.Select>
                    </Form.Group>

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

export default TableForm;