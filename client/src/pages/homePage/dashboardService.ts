import api from "@/shared/axios";

interface ChamadoData {
    id?: number;
    status: string;
    prioridade: string;
    tipo: string;
    assunto: string;
    descricao: string;
    dataAbertura: Date;
    dataFechamento?: Date;
    usuarioId: number;
}

const dashboardService = {
    postChamados: (chamadoData: ChamadoData) => {
        api.post("/api/chamado", chamadoData)
            .then((response) => {
                console.log("Chamado criado com sucesso:", response.data);
            })
            .catch((error) => {
                console.error("Erro ao criar chamado:", error);
            });
    }
}

export default dashboardService;