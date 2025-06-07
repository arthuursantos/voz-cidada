import api from "@/shared/axios";
import { ChamadoInterface } from "./types";

const chamadoService = {
    getAllChamados: (page: number = 0, size: number = 10, sort?: string) => {
        const params: any = { page, size };
        if (sort) {
            params.sort = sort;
        }
        return api.get('/api/chamado', { params });
    },

    updateChamado: async (data: ChamadoInterface) => {
        return await api.put('/api/chamado', data);
    }
};

export default chamadoService;