import api from "@/shared/axios.ts";
import {ChamadoInterface} from "@/pages/Admin/types";

type ListChamadosParams = {
    page?: number;
    size?: number;
    sort?: string;
};

type ListChamadosByUserIdParams = ListChamadosParams & {
    userId: number;
};

type ListChamadosBySecretariaParams = ListChamadosParams & {
    secretaria: string;
};

const chamadoService = {

    findAll: (params?: ListChamadosParams) => {
        return api.get('/api/chamado', { params });
    },

    create: (data: ChamadoInterface) => {
        return api.post('/api/chamado', data);
    },

    findById: (id: number) => {
        return api.get(`/api/chamado/${id}`);
    },

    update: (data: ChamadoInterface) => {
        return api.put('/api/chamado', data);
    },

    deleteById: (id: number) => {
        return api.delete(`/api/chamado/${id}`);
    },

    findByUserId: (params: ListChamadosByUserIdParams) => {
        const { userId, ...queryParams } = params;
        return api.get(`/api/chamado/user/${userId}`, { params: queryParams });
    },

    findBySecretaria: (params: ListChamadosBySecretariaParams) => {
        const { secretaria, ...queryParams } = params;
        return api.get(`/api/chamado/secretaria/${secretaria}`, { params: queryParams });
    },
};

export default chamadoService;