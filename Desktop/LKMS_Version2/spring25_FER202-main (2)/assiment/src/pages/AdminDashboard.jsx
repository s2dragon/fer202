import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUsersApi, updateUserApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (e) {
      toast.error("Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await updateUserApi(userId, { status: newStatus });
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      toast.success(`Đã cập nhật trạng thái thành "${newStatus}"`);
    } catch (e) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserApi(userId, { role: newRole });
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Đã cập nhật quyền thành "${newRole}"`);
    } catch (e) {
      toast.error("Cập nhật quyền thất bại");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const bannedCount = users.filter((u) => u.status === "banned").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  const statusLabel = (s) => {
    if (s === "active") return "Hoạt động";
    if (s === "pending") return "Chờ duyệt";
    if (s === "banned") return "Đã khóa";
    return s;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .admin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f2f5 0%, #e8ecf1 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .admin-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        .admin-header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .admin-header .user-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .admin-header .user-info span {
          font-size: 14px;
          opacity: 0.9;
        }

        .admin-logout-btn {
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

        .admin-logout-btn:hover {
          background: rgba(255,255,255,0.35);
        }

        .admin-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 24px;
        }

        .stat-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .stat-card .stat-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .stat-card .stat-number {
          font-size: 28px;
          font-weight: 800;
          color: #1a1a2e;
        }

        .stat-card .stat-label {
          font-size: 13px;
          color: #888;
          font-weight: 500;
          margin-top: 2px;
        }

        .admin-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .admin-search {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s;
          outline: none;
          background: white;
        }

        .admin-search:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .admin-filter {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          background: white;
          cursor: pointer;
          outline: none;
          transition: all 0.3s;
        }

        .admin-filter:focus {
          border-color: #667eea;
        }

        .admin-table-wrap {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table thead th {
          padding: 14px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #888;
          background: #fafbfc;
          border-bottom: 2px solid #f0f0f0;
        }

        .admin-table tbody tr {
          transition: background 0.2s;
          border-bottom: 1px solid #f5f5f5;
        }

        .admin-table tbody tr:hover {
          background: #f8f9ff;
        }

        .admin-table tbody tr:nth-child(even) {
          background: #fcfcfd;
        }

        .admin-table tbody tr:nth-child(even):hover {
          background: #f8f9ff;
        }

        .admin-table td {
          padding: 14px 16px;
          font-size: 14px;
          vertical-align: middle;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-active { background: #e6f9ed; color: #1b8a4a; }
        .status-pending { background: #fff8e6; color: #b58a00; }
        .status-banned { background: #ffe6e6; color: #d63031; }

        .role-select {
          padding: 6px 10px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          background: white;
          transition: all 0.2s;
          outline: none;
        }

        .role-select:focus {
          border-color: #667eea;
        }

        .action-btns {
          display: flex;
          gap: 6px;
        }

        .act-btn {
          padding: 6px 14px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .act-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }

        .act-approve { background: #28a745; color: white; }
        .act-ban { background: #dc3545; color: white; }
        .act-unban { background: #17a2b8; color: white; }

        .empty-row {
          text-align: center;
          color: #999;
          padding: 40px 16px !important;
          font-size: 14px;
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-header">
          <h1>Trang Quản Trị</h1>
          <div className="user-info">
            <span>Xin chào, <strong>{user?.username}</strong></span>
            <button onClick={handleLogout} className="admin-logout-btn">Đăng xuất</button>
          </div>
        </div>

        <div className="admin-body">
          <div className="stat-cards">
            <div className="stat-card">

              <div className="stat-number">{totalUsers}</div>
              <div className="stat-label">Tổng tài khoản</div>
            </div>
            <div className="stat-card">

              <div className="stat-number">{activeCount}</div>
              <div className="stat-label">Đang hoạt động</div>
            </div>
            <div className="stat-card">

              <div className="stat-number">{pendingCount}</div>
              <div className="stat-label">Chờ duyệt</div>
            </div>
            <div className="stat-card">

              <div className="stat-number">{bannedCount}</div>
              <div className="stat-label">Đã khóa</div>
            </div>
          </div>

          <div className="admin-controls">
            <input
              className="admin-search"
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="admin-filter" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">Tất cả quyền</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="user">User</option>
            </select>
            <select className="admin-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="banned">Đã khóa</option>
            </select>
          </div>

          <div className="admin-table-wrap">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#999" }}>Đang tải dữ liệu...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td><strong>{u.username}</strong></td>
                      <td>
                        <select
                          className="role-select"
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          disabled={u.id === user.id}
                        >
                          <option value="user">User</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge status-${u.status || "active"}`}>
                          {statusLabel(u.status || "active")}
                        </span>
                      </td>
                      <td>
                        {u.id !== user.id && (
                          <div className="action-btns">
                            {u.status === "pending" && (
                              <button className="act-btn act-approve" onClick={() => handleUpdateStatus(u.id, "active")}>
                                Duyệt
                              </button>
                            )}
                            {u.status === "active" && (
                              <button className="act-btn act-ban" onClick={() => handleUpdateStatus(u.id, "banned")}>
                                Khóa
                              </button>
                            )}
                            {u.status === "banned" && (
                              <button className="act-btn act-unban" onClick={() => handleUpdateStatus(u.id, "active")}>
                                Mở khóa
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td className="empty-row" colSpan="5">Không tìm thấy tài khoản nào</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
