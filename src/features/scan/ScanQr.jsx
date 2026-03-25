import React from "react";
import { Container, Card, Form, Button, InputGroup, Row, Col } from "react-bootstrap";

export default function ScanQr({ qrCode, setQrCode, onScan }) {
  return (
    <div className="d-flex flex-column align-items-center mb-5 pb-5">
      {/* Hero Banner Section */}
      <div 
        className="position-relative w-100 mb-5 shadow-lg rounded-4 overflow-hidden" 
        style={{ 
          height: "450px", 
          backgroundImage: "url('/banner.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      >
        {/* Dark overlay for contrast */}
        <div 
          className="position-absolute w-100 h-100 bg-dark" 
          style={{ opacity: 0.65, top: 0, left: 0 }}
        ></div>
        
        {/* Hero Content */}
        <div className="position-relative h-100 d-flex flex-column justify-content-center text-white text-center px-3" style={{ zIndex: 5 }}>
          <h1 className="display-4 fw-bolder mb-3" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)", letterSpacing: "-1px" }}>
            Tinh Hoa Ẩm Thực Hàn Quốc <i className="bi bi-stars text-warning"></i>
          </h1>
          <p className="lead fw-medium mb-4 mx-auto" style={{ maxWidth: "700px", textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>
            Trải nghiệm Lẩu Tokbokki đỉnh cao và Buffet Nướng thượng hạng với không gian sang trọng và cung cách phục vụ hoàn hảo nhất.
          </p>
        </div>
      </div>

      {/* Action Card */}
      <Container style={{ marginTop: "-120px", position: "relative", zIndex: 10, maxWidth: "700px" }}>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
          <Card.Body className="p-4 p-md-5 text-center">
            <div className="mb-4">
              <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: "65px", height: "65px" }}>
                <i className="bi bi-qr-code-scan fs-2"></i>
              </div>
              <h2 className="fw-bold fs-3 text-dark mb-2">Bắt Đầu Trải Nghiệm</h2>
              <p className="text-secondary mb-0">Hệ thống gọi món thông minh. Quét mã QR trên bàn hoặc nhập mã bàn bên dưới để xem thực đơn & gọi món ngay.</p>
            </div>
            
            <InputGroup size="lg" className="mb-4 shadow-sm rounded-pill overflow-hidden border border-2 border-danger border-opacity-25">
              <span className="input-group-text bg-white border-0 text-danger ps-4">
                <i className="bi bi-geo-alt-fill fs-5"></i>
              </span>
              <Form.Control
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Nhập mã bàn (VD: R1_T1)..."
                className="py-3 border-0 shadow-none fs-5 text-center fw-bold text-dark"
                style={{ backgroundColor: "#fff", letterSpacing: "1px" }}
              />
              <Button 
                variant="danger" 
                onClick={onScan} 
                className="fw-bold px-4 px-md-5 fs-5 text-uppercase"
              >
                Vào Bàn <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </InputGroup>

            <div className="d-flex align-items-center justify-content-center gap-2 text-muted fw-medium small">
               <i className="bi bi-info-circle-fill text-primary"></i> Tip: Dùng chức năng quét Camera của điện thoại hoặc Zalo để vào link bàn tự động!
            </div>
          </Card.Body>
        </Card>
        
        {/* Features Row */}
        <Row className="text-center mt-5 pt-4 g-4 w-100 mx-0">
           <Col xs={12} md={4} className="d-flex flex-column align-items-center px-3">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mb-3 transition-hover" style={{ width: "60px", height: "60px" }}>
                 <i className="bi bi-phone-fill fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">Gọi Món Chọn Lọc</h5>
              <p className="small text-muted mb-0">Chạm màn hình là thấy menu, mọi thức ăn đều được mô tả trực quan sinh động.</p>
           </Col>
           <Col xs={12} md={4} className="d-flex flex-column align-items-center px-3">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
                 <i className="bi bi-stopwatch-fill fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">Phục Vụ Siêu Tốc</h5>
              <p className="small text-muted mb-0">Đơn hàng được gửi thẳng đến nhà bếp, không cần chờ đợi nhân viên order.</p>
           </Col>
           <Col xs={12} md={4} className="d-flex flex-column align-items-center px-3">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
                 <i className="bi bi-wallet2 fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">Minh Bạch Chi Tiêu</h5>
              <p className="small text-muted mb-0">Luôn hiển thị tổng tiền hoá đơn real-time theo thời gian thực.</p>
           </Col>
        </Row>
      </Container>
    </div>
  );
}