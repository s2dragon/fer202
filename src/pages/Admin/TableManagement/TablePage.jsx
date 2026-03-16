import { useState } from 'react';
import TableList from './TableList';
import TableForm from './TableForm';

const TablePage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);

    const handleOpenForm = (table = null) => {
        setEditingTable(table);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTable(null);
    };

    return (
        <div>
            <h2>Quản lý Bàn & Mã QR</h2>
            <button
                onClick={() => handleOpenForm()}
                style={{ padding: '10px 16px', marginBottom: '20px' }}
            >
                + Thêm bàn mới
            </button>

            <TableList onEdit={handleOpenForm} />

            {isFormOpen && (
                <TableForm
                    table={editingTable}
                    onClose={handleCloseForm}
                    onSuccess={handleCloseForm}
                />
            )}
        </div>
    );
};

export default TablePage;