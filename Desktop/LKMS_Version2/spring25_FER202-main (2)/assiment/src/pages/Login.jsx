import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginApi } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginApi(username, password);
      login(user);
      toast.success("Đăng nhập thành công!");
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff");
      else navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', system-ui, sans-serif;
          padding: 20px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .login-title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
        }

        .login-subtitle {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin: 0 0 28px;
        }

        .input-group {
          position: relative;
          margin-bottom: 18px;
        }

        .input-group .icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.5;
        }

        .input-group input {
          width: 100%;
          padding: 14px 14px 14px 42px;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: #fafafa;
          outline: none;
        }

        .input-group input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.45);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-links {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: #666;
        }

        .login-links a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .login-links a:hover {
          color: #764ba2;
        }

        .login-links .back-link {
          display: inline-block;
          margin-top: 12px;
          color: #999;
          font-weight: 500;
        }

        .login-links .back-link:hover {
          color: #667eea;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">👤</div>
          <h2 className="login-title">Đăng Nhập</h2>
          <p className="login-subtitle">Chào mừng bạn quay trở lại</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="login-links">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            <br />
            <Link to="/" className="back-link">← Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </>
  );
}
