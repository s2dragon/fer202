import { useState } from 'react';
import MenuList from './MenuList';
import MenuForm from './MenuForm';

const MenuPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleOpenForm = (item = null) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    return (
        <div>
            <h2>Quản lý Menu</h2>
            <button
                onClick={() => handleOpenForm()}
                style={{ padding: '10px 16px', marginBottom: '20px' }}
            >
                + Thêm món mới
            </button>

            <MenuList onEdit={handleOpenForm} />

            {isFormOpen && (
                <MenuForm
                    item={editingItem}
                    onClose={handleCloseForm}
                    onSuccess={() => {
                        handleCloseForm();
                        // Nếu muốn refresh list tự động thì có thể truyền callback refresh từ MenuList
                    }}
                />
            )}
        </div>
    );
};

export default MenuPage;