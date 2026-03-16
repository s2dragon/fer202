// React + React Router v6
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

import Dashboard from '../pages/Admin/Dashboard';
import MenuPage from '../pages/Admin/MenuManagement/MenuPage';
import BuffetPage from '../pages/Admin/BuffetManagement/BuffetPage';
import TablePage from '../pages/Admin/TableManagement/TablePage';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                {/* Index route cho /admin */}
                <Route index element={<Dashboard />} />

                {/* Các route con */}
                <Route path="menu" element={<MenuPage />} />
                <Route path="buffet" element={<BuffetPage />} />
                <Route path="tables" element={<TablePage />} />

                {/* Redirect nếu truy cập đường dẫn không hợp lệ */}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;