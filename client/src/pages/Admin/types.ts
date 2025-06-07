export type Status = "CONCLUÍDO" | "EM ANDAMENTO" | "PENDENTE"
export interface ChamadoInterface {
    id: number;
    titulo: string;
    descricao: string;
    secretaria: string;
    dataAbertura: string;
    status: Status | string;
    latitude: number | null
    longitude: number | null
    fotoAntesUrl: string | null;
    fotoDepoisUrl: string | null;
    historicos: HistoricoInterface[];
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