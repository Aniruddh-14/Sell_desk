import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

export async function uploadInvoice(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}

export async function getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
}

export async function getDashboard() {
    const res = await api.get('/dashboard');
    return res.data;
}

export async function getInvoices() {
    const res = await api.get('/invoices');
    return res.data;
}

export async function getITRReport() {
    const res = await api.get('/reports/itr');
    return res.data;
}

export async function getInsights(body = {}) {
    const res = await api.post('/insights', body);
    return res.data;
}

export async function exportCSV() {
    const res = await api.get('/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export default api;
