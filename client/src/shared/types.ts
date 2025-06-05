export type Status = "CONCLUÍDO" | "EM ANDAMENTO" | "PENDENTE"
export interface ChamadoInterface {
    id: number;
    titulo: string;
    descricao: string;
    secretaria: string;
    dataAbertura: string;
    status: Status | string;
    fotoAntesUrl: string;
    fotoDepoisUrl: string;
    historicos: HistoricoInterface[];
    avaliacao: AvaliacaoInterface;
}

export interface HistoricoInterface {
    id?: number;
    chamadoId: number;
    funcionarioId?: number;
    dataModificacao: string;
    statusAnterior: string;
    statusNovo: string;
    observacao: string;
}

export interface AvaliacaoInterface {
    id?: number;
    chamadoId: number;
    usuarioId?: number;
    estrelas: number;
    comentario?: string | null;
    dataAvaliacao: string;
}

export interface PageInfoInterface {
    totalElements: number,
    totalPages: number,
}