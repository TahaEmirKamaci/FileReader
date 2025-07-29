import api from './api';

const categoryService = {
    getAllCategories: async () => {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/categories', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    getCategoryById: async (id) => {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/categories/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    createCategory: async (categoryData) => {
        const token = localStorage.getItem('token');
        const response = await api.post('/api/categories', categoryData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const token = localStorage.getItem('token');
        const response = await api.put(`/api/categories/${id}`, categoryData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    deleteCategory: async (id) => {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/api/categories/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    }
};

export default categoryService;