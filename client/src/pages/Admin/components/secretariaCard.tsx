interface SecretariaCardProps {
    title: string;
    description: string;
    funcionariosCount: number;
    chamadosData: {
        PENDENTE: number;
        EM_ANDAMENTO: number;
        CONCLUIDO: number;
        TOTAL: number;
    };
}

const SecretariaCard: React.FC<SecretariaCardProps> = ({ 
    title, 
    description, 
    funcionariosCount, 
    chamadosData 
}) => {
    return (
        <div className="rounded-lg border bg-white shadow">
            <div className="p-4 pb-2 flex flex-row items-center justify-between border-b">
                <h3 className="text-lg font-medium">{title}</h3>
            </div>
            <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">
                    {description}
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                    <div>Funcionários: <span className="font-medium">{funcionariosCount}</span></div>
                    <div>Chamados Total: <span className="font-medium">{chamadosData.TOTAL}</span></div>
                </div>
                <div className="text-sm mt-2 space-y-1">
                    <div className="flex ">
                        <p>
                            <span>Pendentes: </span>
                            <span className="font-medium">{chamadosData.PENDENTE}</span>
                        </p>
                    </div>
                    <div className="flex">
                        <p>
                            <span>Em andamento: </span>
                            <span className="font-medium">{chamadosData.EM_ANDAMENTO}</span>
                        </p>
                    </div>
                    <div className="flex ">
                        <p>
                            <span>Concluídos: </span>
                            <span className="font-medium">{chamadosData.CONCLUIDO}</span>
                        </p>         
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretariaCard;