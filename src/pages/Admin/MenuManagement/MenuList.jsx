import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { Table, Button } from 'react-bootstrap';

const MenuList = ({ onEdit }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await api.get('/menuItems');
                setItems(response.data);
            } catch (error) {
                console.error('Lỗi tải danh sách menu:', error);
            }
        };
        fetchMenuItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa món này?')) return;
        try {
            await api.delete(`/menuItems/${id}`);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            alert('Xóa thất bại');
        }
    };

    return (
        <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
                <tr>
                    <th>Tên món</th>
                    <th>Giá</th>
                    <th>Danh mục</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.price.toLocaleString()} đ</td>
                        <td>{item.categoryId}</td>
                        <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(item)}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
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

export default MenuList;