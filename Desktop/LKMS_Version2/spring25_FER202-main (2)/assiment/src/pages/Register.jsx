import React, { useState } from "react";
import { registerApi } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerApi({ username, password, role });
      if (role === "staff") {
        toast.success("Đăng ký thành công! Tài khoản nhân viên đang chờ duyệt.");
      } else {
        toast.success("Đăng ký thành công!");
      }
      setTimeout(() => navigate("/login"), 2000);
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

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          font-family: 'Inter', system-ui, sans-serif;
          padding: 20px;
        }

        .register-card {
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

        .register-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #11998e, #38ef7d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
          box-shadow: 0 8px 24px rgba(17, 153, 142, 0.4);
        }

        .register-title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
        }

        .register-subtitle {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin: 0 0 28px;
        }

        .reg-input-group {
          position: relative;
          margin-bottom: 18px;
        }

        .reg-input-group .icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.5;
        }

        .reg-input-group input {
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

        .reg-input-group input:focus {
          border-color: #11998e;
          background: white;
          box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.1);
        }

        .reg-select-group {
          margin-bottom: 18px;
        }

        .reg-select-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          margin-bottom: 6px;
        }

        .reg-select-group select {
          width: 100%;
          padding: 14px;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: #fafafa;
          outline: none;
          cursor: pointer;
          appearance: auto;
        }

        .reg-select-group select:focus {
          border-color: #11998e;
          background: white;
          box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.1);
        }

        .register-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #11998e, #38ef7d);
          color: white;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(17, 153, 142, 0.45);
        }

        .register-btn:active { transform: translateY(0); }
        .register-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .register-links {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: #666;
        }

        .register-links a {
          color: #11998e;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .register-links a:hover { color: #0e7c6e; }

        .register-links .back-link {
          display: inline-block;
          margin-top: 12px;
          color: #999;
          font-weight: 500;
        }

        .register-links .back-link:hover { color: #11998e; }
      `}</style>

      <div className="register-page">
        <div className="register-card">
          <div className="register-icon">📝</div>
          <h2 className="register-title">Đăng Ký</h2>
          <p className="register-subtitle">Tạo tài khoản mới để bắt đầu</p>

          <form onSubmit={handleRegister}>
            <div className="reg-input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="reg-input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="reg-select-group">
              <label>Vai trò</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">🙋 Khách hàng (User)</option>
                <option value="staff">👨‍🍳 Nhân viên (Staff)</option>
              </select>
            </div>
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng Ký"}
            </button>
          </form>

          <div className="register-links">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            <br />
            <Link to="/" className="back-link">← Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </>
  );
}
