import api from './api';

export const fileService = {
  uploadFiles: async (files, fileType) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post(`/api/upload/${fileType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
export default fileService;