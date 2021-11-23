import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://localhost:4000/'
    //baseURL: 'http://3.237.42.90:3000/'
});

export default clienteAxios;