import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export const createLead = (leadData) => API.post('/leads', leadData);
export const fetchLeads = () => API.get('/leads');
export const fetchMyLeads = () => API.get('/leads/my-leads');
export const updateLead = (id, leadData) => API.put(`/leads/${id}`, leadData);

export default API;
