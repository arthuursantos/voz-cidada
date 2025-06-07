import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { ChamadoInterface } from '@/shared/types';
import { Clock, Calendar } from 'lucide-react';
import { formatDate, getStatusBadge } from '@/pages/Funcionario';

interface HistoricoChamadoProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    selectedChamado: ChamadoInterface | null;
    isUser?: boolean;
    userNames?: string;
}   

const HistoricoChamado = ({ dialogOpen, setDialogOpen, selectedChamado, isUser, userNames } : HistoricoChamadoProps) => {


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                <span>Histórico do Chamado:</span>
                <span className="truncate max-w-[300px]">{selectedChamado?.titulo}</span>
                </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                {selectedChamado && getStatusBadge(selectedChamado.status)}
                <div className="text-sm text-gray-500">
                    Aberto em: {selectedChamado && formatDate(selectedChamado.dataAbertura)}
                </div>
                {
                    !isUser && (
                        <div className="text-sm text-gray-500">
                            Solicitante: {selectedChamado && userNames}
                        </div>
                    )
                }
                
                </div>

                <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                    {selectedChamado?.historicos && selectedChamado.historicos.length > 0 ? (
                    selectedChamado.historicos.map((item, index) => {
                        const [date, time] = item.dataModificacao.split(" ");
                        return (
                        <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                            <div className="absolute w-3 h-3 bg-cyan-600 rounded-full -left-[7px] top-0"></div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-1">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {date}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {time}
                                <span className="text-gray-400"> (modificado)</span>
                            </div>
                            </div>
                            <p className="font-medium">{item.observacao}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                Status Anterior: {getStatusBadge(item.statusAnterior)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Status Modificado: {getStatusBadge(item.statusNovo)}
                            </p>
                        </div>
                        );
                    })
                    ) : (
                    <div className="text-center text-gray-500 py-4">
                        Nenhum histórico registrado para este chamado
                    </div>
                    )}
                </div>
                </ScrollArea>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default HistoricoChamado