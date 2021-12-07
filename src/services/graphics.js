import http from './config';

export default {
  findAndCountTypeInvestments: (query) => (http.get('/graphics/count-types', { params: query })),
  findAndCountCodeInvestments: (query) => (http.get('/graphics/count-codes', { params: query })),
};
