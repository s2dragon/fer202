import React from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';

// Placeholder cho các trang chưa code xong
const Placeholder = (props) => {
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Phần {props.title}</h2>
            <p style={{ color: '#888', fontSize: '18px' }}>
                Chưa hoàn thiện phần này. Đang trong quá trình phát triển.
            </p>
            <Link to="/">Quay về Trang chủ</Link>
        </div>
    );
};

// Trang chủ mới – hiển thị trạng thái các phần
/*
Khi hoàn thiện thêm phần nào, chỉ cần thay <Placeholder ... /> bằng component thật ở route tương ứng, và cập nhật lại nút ở HomePage thành nút active (thay disabled và màu xám bằng màu xanh + Link).
*/

// Chỉ thay đổi phần HomePage trong src/App.js

const HomePage = () => {
    return (
        <Container fluid className="py-5 bg-light min-vh-100">
            <Container>
                <h1 className="text-center mb-5 fw-bold text-primary">
                    Hệ thống Quản lý Nhà hàng - QR Order & Buffet
                </h1>

                <Row className="mb-5">
                    <Col lg={8} className="mx-auto">
                        <Card className="shadow-lg border-0">
                            <Card.Header className="bg-primary text-white text-center py-3">
                                <h4 className="mb-0">Các phần đã hoàn thiện</h4>
                            </Card.Header>
                            <Card.Body>
                                <Card className="border-success mb-4">
                                    <Card.Body className="text-center">
                                        <h5 className="mb-3">Admin / Staff Dashboard</h5>
                                        <p className="text-muted mb-3">
                                            Đã hoàn thiện: Dashboard, Quản lý Menu, Quản lý Buffet, Quản lý Bàn & QR Code
                                        </p>
                                        <Link to="/admin">
                                            <Button variant="success" size="lg">
                                                Vào Dashboard ngay →
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>

                                {/* Có thể thêm các phần khác khi hoàn thiện sau */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <h3 className="text-center mb-4">Các phần còn lại (đã có route nhưng chưa code giao diện)</h3>
                <Row xs={1} md={2} lg={3} className="g-4">
                    <Col>
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Trang chủ khách hàng</Card.Title>
                                <Card.Text className="text-muted small">(Route: /)</Card.Text>
                                <Badge bg="secondary" className="mb-3">Chưa hoàn thiện</Badge>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>QR Order (Dine-in)</Card.Title>
                                <Card.Text className="text-muted small">(Route: /menu/:qrCode)</Card.Text>
                                <Badge bg="secondary" className="mb-3">Chưa hoàn thiện</Badge>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Màn hình Bếp (Kitchen)</Card.Title>
                                <Card.Text className="text-muted small">(Route: /kitchen)</Card.Text>
                                <Badge bg="secondary" className="mb-3">Chưa hoàn thiện</Badge>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Thu ngân (Cashier)</Card.Title>
                                <Card.Text className="text-muted small">(Route: /cashier)</Card.Text>
                                <Badge bg="secondary" className="mb-3">Chưa hoàn thiện</Badge>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Đặt bàn Online (Booking)</Card.Title>
                                <Card.Text className="text-muted small">(Route: /booking)</Card.Text>
                                <Badge bg="secondary" className="mb-3">Chưa hoàn thiện</Badge>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="h-100 shadow-sm border-primary">
                            <Card.Body className="text-center">
                                <Card.Title>Đăng nhập (Auth)</Card.Title>
                                <Card.Text className="text-muted small">(Route: /login)</Card.Text>
                                <Link to="/login">
                                    <Button variant="primary" className="mt-2">
                                        Vào trang đăng nhập →
                                    </Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="text-center mt-5 text-muted small">
                    <p>Backend: json-server (cổng 9999) | Frontend: React + React-Bootstrap</p>
                    <p>Thời gian hiện tại: {new Date().toLocaleString('vi-VN')}</p>
                </div>

                {/* Khoảng trống dưới để kiểm tra scroll */}
                <div style={{ height: '200px' }}></div>
            </Container>
        </Container>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang chủ mới */}
                <Route path="/" element={<HomePage />} />

                {/* Phần Admin đã hoàn thiện */}
                <Route path="/admin/*" element={<AdminRoutes />} />

                {/* Các route còn lại – dùng placeholder */}
                <Route path="/login" element={<Placeholder title="Đăng nhập / Auth" />} />
                <Route path="/menu/:qrCode" element={<Placeholder title="QR Order (Dine-in)" />} />
                <Route path="/kitchen" element={<Placeholder title="Màn hình Bếp" />} />
                <Route path="/cashier" element={<Placeholder title="Thu ngân / Cashier" />} />
                <Route path="/booking" element={<Placeholder title="Đặt bàn Online" />} />

                {/* 404 */}
                <Route path="*" element={<div style={{ padding: '100px', textAlign: 'center' }}>
                    <h1>404 - Không tìm thấy trang</h1>
                    <Link to="/">Quay về Trang chủ</Link>
                </div>} />
            </Routes>
        </Router>
    );
}

export default App;