import React, { useState } from "react";
import { loginApi, registerApi } from "../../api/authApi";
import { Container, Card, Form, Button } from "react-bootstrap";

export default function Login({ onLoginSuccess, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Vui lòng nhập đầy đủ thông tin");

    try {
      if (isRegister) {
        await registerApi(username, password, "user");
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        setIsRegister(false);
      } else {
        const user = await loginApi(username, password);
        onLoginSuccess(user);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold">
            {isRegister ? "Đăng Ký" : "Đăng Nhập"}
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tên đăng nhập</Form.Label>
              <Form.Control 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin / staff" 
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Mật khẩu</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456" 
                required
              />
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100 fw-bold py-2 mb-3">
              {isRegister ? "Đăng ký" : "Đăng nhập"}
            </Button>
          </Form>

          <div className="text-center">
            <Button variant="link" className="text-danger text-decoration-none" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
            </Button>
          </div>

          {onBack && (
            <div className="text-center mt-3 pt-3 border-top">
              <Button variant="link" className="text-secondary text-decoration-none" onClick={onBack}>
                ← Trở lại Scan QR Khách
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
