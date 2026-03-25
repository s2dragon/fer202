import React, { useState } from "react";
import { Container, Nav, Card, Button } from "react-bootstrap";
import TableManager from "./TableManager";
import MenuManager from "./MenuManager";
import BuffetManager from "./BuffetManager";
import OrderHistory from "./OrderHistory";

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("tables");

  return (
    <Container className="py-4" style={{ maxWidth: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-0">Dashboard Quản Trị Hệ Thống</h2>
        {onBack && <Button variant="outline-dark" size="sm" onClick={onBack}>Quay lại</Button>}
      </div>

      <Nav variant="pills" className="nav-justified mb-4 gap-2">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === "tables"} 
            onClick={() => setActiveTab("tables")} 
            className={`fw-bold rounded-pill text-dark ${activeTab === 'tables' ? 'bg-danger text-white' : 'bg-light border'}`}
          >
            Quản lý Bàn (QR)
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === "menu"} 
            onClick={() => setActiveTab("menu")} 
            className={`fw-bold rounded-pill text-dark ${activeTab === 'menu' ? 'bg-danger text-white' : 'bg-light border'}`}
          >
            Quản lý Thực đơn
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === "buffet"} 
            onClick={() => setActiveTab("buffet")} 
            className={`fw-bold rounded-pill text-dark ${activeTab === 'buffet' ? 'bg-danger text-white' : 'bg-light border'}`}
          >
            Quản lý Buffet
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === "history"} 
            onClick={() => setActiveTab("history")} 
            className={`fw-bold rounded-pill text-dark ${activeTab === 'history' ? 'bg-danger text-white' : 'bg-light border'}`}
          >
            Lịch sử Đơn hàng
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4 bg-white rounded-4">
          {activeTab === "tables" && <TableManager restaurantId={1} />}
          {activeTab === "menu" && <MenuManager restaurantId={1} />}
          {activeTab === "buffet" && <BuffetManager restaurantId={1} />}
          {activeTab === "history" && <OrderHistory restaurantId={1} />}
        </Card.Body>
      </Card>
    </Container>
  );
}
