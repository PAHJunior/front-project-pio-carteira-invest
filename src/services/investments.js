import http from './config';

export default {
  getAllInvestments: (query) => (http.get('/investments', { params: query })),
  getOneInvestment: (id) => (http.get(`/investments/${id}`)),
  createInvestment: (dados) => (http.post('/investments/', dados)),
  updateInvestment: (id, dados) => (http.put(`/investments/${id}`, dados)),
  deleteInvestment: (id) => (http.delete(`/investments/${id}`)),
};
