import api from './api';

export const personService = {
  getAllPersons: async () => {
    // JWT varsa header'a ekle, yoksa headers göndermeden isteği yap
    const token = localStorage.getItem('jwtToken');
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await api.get('/api/persons', config);
    return response.data;
  }
};
export default personService;