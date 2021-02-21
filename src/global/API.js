import {API_URL} from "@env";
import axios from 'axios';
import {Platform} from 'react-native';

const errorHandler = (err) => {
    if(err.response) {
        console.log(err.response.data)
    } else {
        console.log(err);
    }
};

const API = {
    registerUser: async (data) => {
        return await axios.post(`${API_URL}/register`, data)
            .then(res => res)
            .catch(errorHandler);
    },
    loginUser: async (data) => {
        return await axios.post(`${API_URL}/login`, data)
            .then(res => res)
            .catch(errorHandler);
    },
    logout: async (token) => {
        return await axios.post(`${API_URL}/logout`, {},
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
            .catch(errorHandler);
    },
    getMe: async (token) => {
        return await axios.get(`${API_URL}/api/users/me`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },
    getUser: async (userId, token) => {
        return await axios.get(`${API_URL}/api/users/${userId}`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },
    getUsers: async (token) => {
        return await axios.get(`${API_URL}/api/users`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
            .catch(errorHandler);
    },

    getOrders: async (token) => {
        return await axios.get(`${API_URL}/api/orders`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },

    getOrder:  async (token) => {
        return await axios.get(`${API_URL}/api/orders`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },

    getAgreements:  async (orderId, token) => {
        return await axios.get(`${API_URL}/api/orders/${orderId}/agreements`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },
    selectAgreement:  async (agreementId, token) => {
        return await axios.get(`${API_URL}/api/agreements/${agreementId}/select`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },
    currentAgreement:  async (token) => {
        return await axios.get(`${API_URL}/api/agreements/current`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },
    addAgreement:  async (orderId, token) => {
        return await axios.post(`${API_URL}/api/agreements`, {order_id: orderId},
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },
    setOrderDone:  async (orderId, token) => {
        return await axios.post(`${API_URL}/api/orders/${orderId}/move_status`, {},
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
    },

    createOrder: async (data, token) => {
        const formData = new FormData();
        formData.append('from', data.from);
        formData.append('to', data.to);
        formData.append('passenger_id', data.passenger_id);
        if (data.image) {
            formData.append('image', {
                uri: Platform.OS === 'android' ? data.image.uri : data.image.uri.replace('file://', ''),
                name: `image-1`,
                type: 'image/jpeg',
            });
        }

        const client = axios.create({
            baseURL: API_URL,
        });
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                //'Content-Type': 'multipart/form-data'
            }
        };
        return await client.post('/api/orders', formData, config)
            .then(res => res);
    },

    // getNote: async (data) => {
    //     return await axios.post(`http://localhost:3000/notes/get`, data)
    //         .then(res => res)
    //         .catch(err => console.log(err));
    // },
    // getAllNotes: async (data) => {
    //     return await axios.post(`http://localhost:3000/notes/getAll`, data)
    //         .then(res => res)
    //         .catch(err => console.log(err));
    // },
    // deleteNote: async (data) => {
    //     return await axios.post(`http://localhost:3000/notes/delete`, data)
    //         .then(res => res)
    //         .catch(err => console.log(err));
    // },
    // createNote: async (data) => {
    //     return await axios.post(`http://localhost:3000/notes/add`, data)
    //         .then(res => res)
    //         .catch(err => console.log(err));
    // },
    // editNote: async (data) => {
    //     return await axios.post(`http://localhost:3000/notes/edit`, data)
    //         .then(res => res)
    //         .catch(err => console.log(err));
    // },
};

export default API;
