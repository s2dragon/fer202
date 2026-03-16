import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { Table, Button } from 'react-bootstrap';

const BuffetList = ({ onEdit }) => {
    const [buffets, setBuffets] = useState([]);

    useEffect(() => {
        const fetchBuffets = async () => {
            try {
                const response = await api.get('/buffets');
                setBuffets(response.data);
            } catch (error) {
                console.error('Lỗi tải danh sách buffet:', error);
            }
        };
        fetchBuffets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa gói buffet này?')) return;
        try {
            await api.delete(`/buffets/${id}`);
            setBuffets((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            alert('Xóa thất bại.');
        }
    };

    return (
        <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
                <tr>
                    <th>Tên gói</th>
                    <th>Giá</th>
                    <th>Thời lượng (phút)</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {buffets.map((buffet) => (
                    <tr key={buffet.id}>
                        <td>{buffet.name}</td>
                        <td>{buffet.price.toLocaleString()} đ</td>
                        <td>{buffet.duration}</td>
                        <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(buffet)}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(buffet.id)}
                            >
                                Xóa
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default BuffetList;