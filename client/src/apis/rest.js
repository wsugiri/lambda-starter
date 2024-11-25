import axios from 'axios';

const getUrl = (path) => {
    const baseUrl = (process.env.NODE_ENV === 'development') ? import.meta.env.VITE_API_BASE_URL_DEV : import.meta.env.VITE_API_BASE_URL;
    const url = path.substr(0, 1) === '/' ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
    return url;
};

const getOption = async (method, path, params = {}) => {
    const url = getUrl(path);
    const headers = { 'Content-Type': 'application/json' };
    const data = ['GET', 'DELETE'].indexOf(method) >= 0 ? null : params;

    try {
        return await axios({ url, headers, data, method });
    } catch (err) {
        throw err;
    }
};

const app = {
    get: async ({ url, cred }) => {
        try {
            return await getOption('get', url, null, cred);
        } catch (err) {
            return err?.response || err;
        }
    },
    delete: async ({ url }) => {
        try {
            return await getOption('delete', url);
        } catch (err) {
            return err?.response || err;
        }
    },
    post: async ({ url, data, cred }) => {
        try {
            return await getOption('post', url, data, cred);
        } catch (err) {
            return err?.response || err;
        }
    },
    put: async ({ url, data, cred }) => {
        try {
            return await getOption('put', url, data, cred);
        } catch (err) {
            return err?.response || err;
        }
    },
    uploadSignImage: async (url, file) => {
        try {
            return await axios.put(url, file, { headers: { 'Content-Type': file.type } });
        } catch (err) {
            return err?.response || err;
        }
    },
    getUrl,
};

export const oRest = app;
