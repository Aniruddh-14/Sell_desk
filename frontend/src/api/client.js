import axios from 'axios';
import { supabase } from './supabaseClient';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔑 Auth interceptor — session:', session ? 'EXISTS' : 'NULL');
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('🔑 Token attached, sub:', JSON.parse(atob(session.access_token.split('.')[1])).sub);
    } else {
        console.warn('⚠️ No access_token found in session!');
    }
    return config;
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

export async function uploadPaymentRecords(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/payment-records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}

export async function getPaymentRecords() {
    const res = await api.get('/payment-records');
    return res.data;
}

export async function runReconciliation() {
    const res = await api.post('/reconcile');
    return res.data;
}

export default api;
