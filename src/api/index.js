import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

// Lead APIs
export const createLead = (leadData) => API.post('/leads', leadData);
export const fetchLeads = () => API.get('/leads');
export const fetchMyLeads = () => API.get('/leads/my-leads');
export const updateLead = (id, leadData) => API.put(`/leads/${id}`, leadData);

// Product APIs
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const fetchSellerProducts = () => API.get('/products/my-products');
export const createProduct = (formData) => API.post('/products', formData);
export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export default API;
