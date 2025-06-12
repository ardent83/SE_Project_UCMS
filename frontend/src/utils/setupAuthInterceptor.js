import axios from 'axios';

let hasRedirectedToLogin = false;

export const setupAuthInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (
      response.status === 401 &&
      !hasRedirectedToLogin &&
      window.location.pathname !== '/auth' &&
      window.location.pathname !== '/verification' &&
      window.location.pathname !== '/confirmation'
    ) {
      hasRedirectedToLogin = true;
      window.location.href = '/auth';
    }
    return response;
  };

  axios.interceptors.response.use(
    res => res,
    err => {
      if (
        err.response?.status === 401 &&
        !hasRedirectedToLogin &&
        window.location.pathname !== '/auth' &&
        window.location.pathname !== '/verification' &&
        window.location.pathname !== '/confirmation'
      ) {
        hasRedirectedToLogin = true;
        window.location.href = '/auth';
      }
      return Promise.reject(err);
    }
  );
};


export const resetAuthRedirectFlag = () => {
  hasRedirectedToLogin = false;
};
