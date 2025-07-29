import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import inventoryService from '../services/inventoryService';
import categoryService from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [assignDialog, setAssignDialog] = useState(false);
    const [assignData, setAssignData] = useState({ userId: '', inventoryId: '', amount: 1 });
    const [users, setUsers] = useState([]);
    const toast = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        loadItems();
        loadCategories();
        if (user && user.role === 'ADMIN') loadUsers();
    }, [user]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const data = await inventoryService.getAllItems();
            setItems(data);
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load items', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000 });
        }
    };

    const loadUsers = async () => {
        // API'den tüm kullanıcıları çek (admin için)
        try {
            const res = await fetch('/api/users/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
        }
    };

    const filteredItems = user && user.role === 'ADMIN'
        ? items
        : items.filter(i => i.userId === Number(user.id));

    const openAssignDialog = (inventoryId) => {
        setAssignData({ userId: '', inventoryId, amount: 1 });
        setAssignDialog(true);
    };

    const handleAssign = async () => {
        // API'ye ürün atama isteği gönder
        try {
            await fetch('/api/products/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(assignData)
            });
            toast.current.show({ severity: 'success', summary: 'Başarılı', detail: 'Ürün atandı', life: 2000 });
            setAssignDialog(false);
            loadItems();
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Hata', detail: 'Ürün atama başarısız', life: 3000 });
        }
    };

    const columns = [
        { field: 'id', header: 'ID', style: { minWidth: '5rem' } },
        { field: 'name', header: 'Ürün', style: { minWidth: '12rem' } },
        { field: 'categoryName', header: 'Kategori', style: { minWidth: '10rem' } },
        { field: 'amount', header: 'Kullanıcıdaki Miktar', style: { minWidth: '8rem' } },
        { field: 'totalAmount', header: 'Stok (Toplam)', style: { minWidth: '8rem' } },
        { field: 'username', header: 'Kullanıcı', style: { minWidth: '10rem' } }
    ];

    if (user && user.role === 'ADMIN') {
        columns.push({
            body: (rowData) => (
                <Button icon="pi pi-user-plus" className="p-button-rounded p-button-success p-mr-2" onClick={() => openAssignDialog(rowData.id)} tooltip="Ürün Ata" />
            ),
            style: { minWidth: '6rem' }
        });
    }

    return (
        <div className="flex justify-content-center align-items-center min-h-screen bg-gray-50">
            <Toast ref={toast} />
            <Card className="w-full md:w-10 lg:w-8 xl:w-6 shadow-3 p-4" title="Envanter Yönetimi">
                <div className="flex flex-row justify-content-between align-items-center mb-3">
                    <span className="text-2xl font-semibold">{user && user.role === 'ADMIN' ? 'Tüm Ürünler' : 'Sahip Olduğum Ürünler'}</span>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} placeholder="Ara..." />
                    </span>
                </div>
                <DataTable value={filteredItems} paginator rows={10} loading={loading} globalFilter={globalFilter} emptyMessage="Kayıt bulunamadı."
                    className="p-datatable-sm p-datatable-gridlines p-datatable-striped" responsiveLayout="scroll">
                    {columns.map((col, i) => col.body
                        ? <Column key={i} body={col.body} style={col.style} />
                        : <Column key={i} field={col.field} header={col.header} style={col.style} sortable />
                    )}
                </DataTable>
            </Card>
            <Dialog visible={assignDialog} style={{ width: '400px' }} header="Ürün Ata" modal onHide={() => setAssignDialog(false)}>
                <div className="flex flex-column gap-3">
                    <Dropdown value={assignData.userId} options={users.map(u => ({ label: u.username, value: u.id }))}
                        onChange={e => setAssignData({ ...assignData, userId: e.value })} placeholder="Kullanıcı Seç" className="w-full" />
                    <InputText type="number" min={1} value={assignData.amount} onChange={e => setAssignData({ ...assignData, amount: Number(e.target.value) })} placeholder="Miktar" className="w-full" />
                    <Button label="Ata" icon="pi pi-check" onClick={handleAssign} disabled={!assignData.userId || assignData.amount < 1} className="w-full mt-2" />
                </div>
            </Dialog>
        </div>
    );
};

export default InventoryPage;