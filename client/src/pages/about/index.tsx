import { Link } from "react-router-dom";
import Header from "@/components/header";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header/>

            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="relative w-full md:mr-6 h-40 md:h-auto md:w-1/2 rounded-b-[50%] md:rounded-none">
                    <img
                        src="/images/predios2.png"
                        alt="Voz Cidadã"
                        className="w-full h-full object-cover object-[center_90%] md:object-center rounded-b-[50%] md:rounded-none"
                    />
                </div>

                {/* Imagem da nuvem no canto inferior direito da tela 
                <img
                    src="./images/Nuvem.png"
                    alt="Imagem Nuvem"
                    className="absolutefixed bottom-0 right-0 w-32 h-32 object-contain m-4"
                />*/}

                <div className="flex items-center justify-center w-full pt-8 md:w-1/2">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[--cor-primaria2] font-montserrat lg:text-4xl">Sobre o Voz Cidadã</h2>
                        </div>

                        <div className="p-6 md:p-0">
                            <div className="mt-4 space-y-4 font-lato">
                                <p className="text-md text-gray-600 text-justify lg:text-base">
                                    O Voz Cidadã foi criado para fortalecer a participação da população de Indaiatuba na melhoria da infraestrutura da cidade. A plataforma permite que os cidadãos relatem problemas e façam solicitações, auxiliando as secretarias de Meio Ambiente e Obras a identificar e priorizar manutenções com base na demanda da comunidade.
                                </p>
                                <p className="text-md text-gray-600 text-justify lg:text-base">
                                    Nosso objetivo é aproximar a população da administração pública, tornando a comunicação mais ágil e eficiente. Ao centralizar e repassar as informações às autoridades competentes, facilitamos o processo de manutenção e zelamos por uma cidade mais organizada e bem cuidada.
                                </p>
                                <p className="text-md text-gray-600 text-justify lg:text-base">
                                    É importante destacar que o Voz Cidadã atua como um canal de comunicação entre a sociedade e a prefeitura, mas a responsabilidade pela execução e resolução das demandas registradas cabe exclusivamente ao município de Indaiatuba.
                                </p>
                                <p className="text-md text-gray-600 text-center lg:text-base">
                                    Juntos, podemos construir uma cidade melhor!
                                </p>
                                <div className="mt-6 text-center">
                                    <Link to="/" className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline text-lg">
                                        Voltar à página inicial
                                    </Link>
                                </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
