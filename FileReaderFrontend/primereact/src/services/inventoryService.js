import api from './api';

const inventoryService = {
    getAllItems: async () => {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/inventory/items', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    getItemById: async (id) => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/inventory/items/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    getItemsByCategory: async (categoryId) => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/inventory/items/category/${categoryId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    createItem: async (itemData) => {
        const token = localStorage.getItem('token');
        const response = await api.post('/api/inventory/items', itemData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    updateItem: async (id, itemData) => {
        const token = localStorage.getItem('token');
        const response = await api.put(`/api/inventory/items/${id}`, itemData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    deleteItem: async (id) => {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/api/inventory/items/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    }
};

export default inventoryService;