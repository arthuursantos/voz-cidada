import api from "@/shared/axios.ts";

const authService = {

    login: (data: { login: string; password: string }) => {
        return api.post('/auth/login', data);
    },

    loginWithGoogle: (data: { email: string }) => {
        return api.post('/auth/oauth/google', data);
    },

    register: (data: { login: string; password: string }) => {
        return api.post('/auth/register', data);
    },

    registerAdmin: (data: { login: string; password: string }) => {
        return api.post('/auth/register/admin', data)
    },

    changePassword: (data: { currentPassword: string; newPassword: string }, token: string) => {
        return api.patch('/auth/changePassword', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    updateAuthStatus: (token: string) => {
        return api.patch('/auth/updateAuthStatus', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    refreshToken: (token: string) => {
        return api.post('/auth/refresh', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default authService;