import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { Table, Button, Badge } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

const TableList = ({ onEdit }) => {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await api.get('/tables');
                setTables(response.data);
            } catch (error) {
                console.error('Lỗi tải danh sách bàn:', error);
            }
        };
        fetchTables();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa bàn này?')) return;
        try {
            await api.delete(`/tables/${id}`);
            setTables((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            alert('Xóa bàn thất bại.');
        }
    };

    return (
        <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
                <tr>
                    <th>Số bàn</th>
                    <th>Sức chứa</th>
                    <th>Mã QR</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {tables.map((table) => (
                    <tr key={table.id}>
                        <td>{table.tableNumber}</td>
                        <td>{table.capacity}</td>
                        <td className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <QRCodeSVG
                                    value={`http://localhost:3000/menu/${table.qrCode}`}
                                    size={96}
                                />
                                <Badge bg="info" className="mt-2">
                                    {table.qrCode}
                                </Badge>
                            </div>
                        </td>
                        <td>
                            <Badge
                                bg={table.status === 'available' ? 'success' : 'danger'}
                                className="fs-6"
                            >
                                {table.status === 'available' ? 'Trống' : 'Đang sử dụng'}
                            </Badge>
                        </td>
                        <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(table)}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(table.id)}
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

export default TableList;