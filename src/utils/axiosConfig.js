import axios from "axios";
axios.defaults.baseURL = `${process.env.REACT_APP_API_ENDPOINT}`;
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';