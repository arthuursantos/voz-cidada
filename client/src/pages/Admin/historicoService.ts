import api from "@/shared/axios.ts";

const historicoService = {
    findAll: (page: number = 0, size: number = 10, sort?: string) => {
        const params: any = { page, size };
        if (sort) {
            params.sort = sort;
        }
        return api.get('/api/historico', { params });
    },

    findById: (id: number) => {
        return api.get(`/api/historico/${id}`);
    },

    create: (historicoData: any) => {
        return api.post('/api/historico', historicoData);
    },

    update: (historicoData: any) => {
        return api.put('/api/historico', historicoData);
    },

    delete: (id: number) => {
        return api.delete(`/api/historico/${id}`);
    },
};

export default historicoService;