import {API_URL} from "@env"
import axios from 'axios';

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
    getUsers: async (token) => {
        return await axios.get(`${API_URL}/api/users`,
            { headers: {Authorization: `Bearer ${token}`}})
            .then(res => res)
            .catch(errorHandler);
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
