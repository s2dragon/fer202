import { http as client } from "./client";

export const loginApi = async (username, password) => {
  const res = await client("GET", `/users?username=${username}`);
  
  if (res && res.length > 0) {
    const user = res.find(u => u.username === username && u.password === password);
    if (user) return user;
  }
  throw new Error("Sai tên đăng nhập hoặc mật khẩu");
};

export const registerApi = async (username, password, role = "user") => {
  const check = await client("GET", `/users?username=${username}`);
  if (check && check.length > 0) {
    throw new Error("Tên đăng nhập đã tồn tại");
  }

  return await client("POST", "/users", {
    username,
    password,
    role
  });
};
