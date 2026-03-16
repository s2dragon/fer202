import { useState } from 'react';
import BuffetList from './BuffetList';
import BuffetForm from './BuffetForm';

const BuffetPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBuffet, setEditingBuffet] = useState(null);

    const handleOpenForm = (buffet = null) => {
        setEditingBuffet(buffet);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingBuffet(null);
    };

    return (
        <div>
            <h2>Quản lý Gói Buffet</h2>
            <button
                onClick={() => handleOpenForm()}
                style={{ padding: '10px 16px', marginBottom: '20px' }}
            >
                + Thêm gói buffet mới
            </button>

            <BuffetList onEdit={handleOpenForm} />

            {isFormOpen && (
                <BuffetForm
                    buffet={editingBuffet}
                    onClose={handleCloseForm}
                    onSuccess={handleCloseForm}
                />
            )}
        </div>
    );
};

export default BuffetPage;