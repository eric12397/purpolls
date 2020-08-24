import axios from 'axios'

const baseURL = 'http://localhost:8000/api/';

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000, 
  headers: {
    'Authorization' : localStorage.getItem('accessToken') ? "Bearer " + localStorage.getItem('accessToken') : null,
    'Content-Type' : 'application/json',
    'Accept' : 'application/json'
  }
})

axiosInstance.interceptors.response.use(
  response => response, 
  error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url === baseURL + 'token/refresh/') {
      window.location.href = '/login';
      return Promise.reject(error)
    }

    if (error.response.data.code === "token_not_valid" && 
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized") {

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

        const now = Math.ceil(Date.now() / 1000);
        console.log(tokenParts.exp)
        console.log(now)

        if (tokenParts.exp > now) {
          return axiosInstance
            .post('/token/refresh/', { refresh: refreshToken })
            .then(response => {
              localStorage.setItem('accessToken', response.data.access);
              localStorage.setItem('refreshToken', response.data.refresh);

              axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.access;
              originalRequest.headers['Authorization'] = "Bearer " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch(error => {
              console.log(error)
            }); 

        } else {
            console.log("Refresh token is expired", tokenParts.exp, now);
            window.location.href = '/login';
        }
      } else {
        console.log("Refresh token not available. Log back in!");
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
);

export default axiosInstance; 