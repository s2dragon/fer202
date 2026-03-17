import { http } from "./client";

export const loginApi = async (username, password) => {
  const users = await http("GET", `/users?username=${encodeURIComponent(username)}`);

  if (users.length === 0) {
    throw new Error("Không tìm thấy tài khoản!");
  }

  const user = users[0];
  if (user.password !== password) {
    throw new Error("Sai mật khẩu!");
  }

  if (user.status === "pending") {
    throw new Error("Tài khoản của bạn đang chờ quản trị viên duyệt!");
  }

  if (user.status === "banned") {
    throw new Error("Tài khoản của bạn đã bị khóa!");
  }

  return user;
};

export const registerApi = async (userData) => {
  // Check if username exists
  const existing = await http("GET", `/users?username=${encodeURIComponent(userData.username)}`);
  if (existing.length > 0) {
    throw new Error("Tên đăng nhập đã tồn tại!");
  }

  const newUser = {
    ...userData,
    status: userData.role === "staff" ? "pending" : "active",
  };

  return http("POST", "/users", newUser);
};

export const getUsersApi = async () => {
  return http("GET", "/users");
};

export const updateUserApi = async (userId, data) => {
  return http("PATCH", `/users/${userId}`, data);
};
