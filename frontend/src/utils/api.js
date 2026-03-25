import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000/api' })


API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'

        }

        return Promise.reject(error)
    }
)

export const loginAPI = (data) => API.post('/auth/login', data);

export const getMeAPI = () => API.post('/auth/me');
export const createUserAPI = (data) => API.post('/user/create', data);
export const getAllUserAPI = () => API.get('/user/getall');
export const updateUserAPI = (id, data) => API.put(`/user/update/${id}`, data);
export const deleteUserAPI = (id) => API.delete(`/user/delete/${id}`);

export const assignDomainAPI = (data) => API.post('/user/admin/assign', data);
export const getAllDomainAPI = () => API.get('/user/admin/get');
export const adminDeleteDomainAPI = (id) => API.delete(`/user/admin/delete/${id}`);

export const createDomainAPI = (data) => API.post('/domains/create', data);
export const getMyDomainAPI = () => API.get('/domains/get');
export const deleteDomainAPI = (id) => API.delete(`/domains/delete/${id}`);


