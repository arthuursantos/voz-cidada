import api from "@/shared/axios.ts";

const funcionarioService = {
    findAll: (page: number = 0, size: number = 10, sort?: string) => {
        const params: any = { page, size };
        if (sort) {
            params.sort = sort;
        }
        return api.get('/api/funcionario', { params });
    },

    findById: (id: number) => {
        return api.get(`/api/funcionario/${id}`);
    },

    findByAuthUserId: (authUserId: number) => {
        return api.get(`/api/funcionario/auth/${authUserId}`);
    },

    createAdminProfile: (funcionarioData: any) => {
        return api.post('/api/funcionario', funcionarioData);
    },

    deleteById: (id: number) => {
        return api.delete(`/api/funcionario/${id}`);
    }
};

export default funcionarioService;