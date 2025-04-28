import api from "@/shared/axios";

const chamadoService = {
    getAllChamados: (page: number = 0, size: number = 10, sort?: string) => {
        const params: any = { page, size };
        if (sort) {
            params.sort = sort;
        }
        return api.get('/api/chamado', { params });
    },

    updateChamado: (data: {
        id: number;
        secretaria: string;
        usuarioId: number;
    }) => {
        return api.put('/api/chamado', {
            id: data.id,
            secretaria: data.secretaria,
            usuarioId: data.usuarioId
        });
    }
};

export default chamadoService;