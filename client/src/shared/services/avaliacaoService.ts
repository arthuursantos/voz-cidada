import api from "@/shared/axios.ts";
import {AvaliacaoInterface} from "@/shared/types.ts";

type ListAvaliacoesParams = {
    page?: number;
    size?: number;
    sort?: string;
};

const avaliacaoService = {

    findAll: (params?: ListAvaliacoesParams) => {
        return api.get('/api/avaliacao', { params });
    },

    findById: (id: number) => {
        return api.get(`/api/avaliacao/${id}`);
    },
    
    create: (data: AvaliacaoInterface) => {
        return api.post('/api/avaliacao', data);
    },

    update: (data: AvaliacaoInterface) => {
        return api.put('/api/avaliacao', data);
    },

    deleteById: (id: number) => {
        return api.delete(`/api/avaliacao/${id}`);
    },

};

export default avaliacaoService;