import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card, Row, Col, Container } from 'react-bootstrap';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalTables: 0,
        availableTables: 0,
        pendingBookings: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const tablesResponse = await api.get('/tables');
                const bookingsResponse = await api.get('/bookings?status=pending');

                const availableCount = tablesResponse.data.filter(
                    (table) => table.status === 'available'
                ).length;

                setStats({
                    totalTables: tablesResponse.data.length,
                    availableTables: availableCount,
                    pendingBookings: bookingsResponse.data.length,
                });
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu dashboard:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Container>
            <h2 className="mb-4 text-center">Tổng quan hệ thống</h2>
            <Row className="g-4">
                <Col md={4}>
                    <Card border="primary" className="shadow-sm text-center h-100">
                        <Card.Header className="bg-primary text-white">Tổng số bàn</Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <Card.Title className="display-4 fw-bold">{stats.totalTables}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card border="success" className="shadow-sm text-center h-100">
                        <Card.Header className="bg-success text-white">Bàn đang trống</Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <Card.Title className="display-4 fw-bold">{stats.availableTables}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card border="warning" className="shadow-sm text-center h-100">
                        <Card.Header className="bg-warning text-dark">Đặt bàn chờ duyệt</Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <Card.Title className="display-4 fw-bold">{stats.pendingBookings}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;