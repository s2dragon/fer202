import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .staff-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f2f5 0%, #e8ecf1 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .staff-header {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(17, 153, 142, 0.3);
        }

        .staff-header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .staff-header .user-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .staff-header .user-info span {
          font-size: 14px;
          opacity: 0.9;
        }

        .staff-logout-btn {
          padding: 8px 18px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s;
        }

        .staff-logout-btn:hover {
          background: rgba(255,255,255,0.35);
        }

        .staff-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .welcome-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          text-align: center;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #11998e, #38ef7d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 40px;
          box-shadow: 0 8px 24px rgba(17, 153, 142, 0.3);
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
        }

        .welcome-sub {
          color: #666;
          font-size: 15px;
          margin: 0 0 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          max-width: 360px;
          margin: 0 auto;
        }

        .info-item {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 14px;
          text-align: center;
        }

        .info-item .info-label {
          font-size: 12px;
          color: #999;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item .info-value {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin-top: 4px;
        }

        .staff-status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          background: #e6f9ed;
          color: #1b8a4a;
        }
      `}</style>

      <div className="staff-page">
        <div className="staff-header">
          <h1>👨‍🍳 Trang Nhân Viên</h1>
          <div className="user-info">
            <span>Xin chào, <strong>{user?.username}</strong></span>
            <button onClick={handleLogout} className="staff-logout-btn">Đăng xuất</button>
          </div>
        </div>

        <div className="staff-body">
          <div className="welcome-card">
            <div className="welcome-avatar">👋</div>
            <h2 className="welcome-title">Chào mừng, {user?.username}!</h2>
            <p className="welcome-sub">Tính năng xem đơn hàng, quản lý bàn sẽ được cập nhật sau.</p>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Vai trò</div>
                <div className="info-value" style={{textTransform: "capitalize"}}>{user?.role}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Trạng thái</div>
                <div className="info-value">
                  <span className="staff-status-badge">{user?.status || "active"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
