import api from "@/shared/axios.ts";
import {ChamadoCreateInterface, ChamadoInterface} from "@/shared/types.ts";

type ListChamadosParams = {
    page?: number;
    size?: number;
    sort?: string;
};

type ListChamadosByUserIdParams = ListChamadosParams & {
    userId?: number;
};

type ListChamadosBySecretariaParams = ListChamadosParams & {
    secretaria: string;
};

const chamadoService = {

    findAll: (params?: ListChamadosParams) => {
        return api.get('/api/chamado', { params });
    },

    findAllStatus: () => {
        return api.get('/api/chamado/status');
    },

    create: (data: ChamadoCreateInterface) => {
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

    countBySecretaria: (secretaria: string) => {
        return api.get(`/api/chamado/count/${secretaria}`);
    },

};

export default chamadoService;