import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { confirmDialog } from 'primereact/confirmdialog';
import categoryService from '../services/categoryService';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({ name: '', description: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryDialog, setCategoryDialog] = useState(false);
    // const [deleteDialog, setDeleteDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setCategory({ name: '', description: '' });
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const saveCategory = async () => {
        setSubmitted(true);

        if (category.name.trim()) {
            try {
                if (category.id) {
                    // Update existing category
                    await categoryService.updateCategory(category.id, category);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category Updated', life: 3000 });
                } else {
                    // Create new category
                    await categoryService.createCategory(category);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category Created', life: 3000 });
                }

                loadCategories();
                setCategoryDialog(false);
                setCategory({ name: '', description: '' });
            } catch (error) {
                console.error('Error saving category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save category', life: 3000 });
            }
        }
    };

    const editCategory = (category) => {
        setCategory({ ...category });
        setCategoryDialog(true);
    };

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        confirmDialog({
            message: 'Are you sure you want to delete this category?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteCategory()
        });
    };

    const deleteCategory = async () => {
        try {
            await categoryService.deleteCategory(category.id);
            loadCategories();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category', life: 3000 });
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <h4 className="m-0">Manage Categories</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCategory(rowData)} />
            </React.Fragment>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Refresh" icon="pi pi-refresh" className="p-button-help ml-2" onClick={loadCategories} />
            </React.Fragment>
        );
    };

    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveCategory} />
        </React.Fragment>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <Card title="Categories">
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={categories} selection={selectedCategory} onSelectionChange={(e) => setSelectedCategory(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
                        globalFilter={globalFilter} header={header} loading={loading} emptyMessage="No categories found.">
                        <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                        <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="description" header="Description" sortable style={{ minWidth: '20rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </Card>
            </div>

            <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Category Details" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} required autoFocus
                        className={submitted && !category.name ? 'p-invalid' : ''} />
                    {submitted && !category.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} rows={3} cols={20} />
                </div>
            </Dialog>
        </div>
    );
};

export default CategoriesPage;