export type Status = "CONCLUÍDO" | "EM ANDAMENTO" | "PENDENTE"
export interface ChamadoInterface {
    id: number;
    usuarioId?: number;
    titulo: string;
    descricao?: string;
    secretaria?: string;
    dataAbertura: string;
    status: Status | string;
    latitude?: number | null
    longitude?: number | null
    fotoAntesUrl?: string | null;
    fotoDepoisUrl?: string | null;
    avaliacao?: AvaliacaoInterface | null;
    historicos: HistoricoInterface[];
}
export interface ChamadoCreateInterface {
    usuarioId: number;
    titulo: string;
    descricao: string;
    status: Status | string;
    latitude: number | null;
    longitude: number | null;
    fotoAntesUrl?: string | null;
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
    estrelas: number;
    comentario?: string | null;
    dataAvaliacao: string;
    usuarioId?: number;
}

export interface PageInfoInterface {
    totalElements: number,
    totalPages: number,
}