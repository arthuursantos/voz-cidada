import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'; // Exemplo de ícones com react-icons
import { Bell, LogOut, User } from 'lucide-react'; // Adicionando os ícones necessários para o header

const Contact = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-[#2B87B3] text-white p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-8 w-8" />
                        <div className="flex flex-col">
                            <span className="text-sm">Nome_cidadão</span>
                            <button className="text-xs hover:underline">
                                <span className="flex items-center gap-1">
                                    <LogOut className="h-3 w-3" />
                                    Finalizar Sessão
                                </span>
                            </button>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="hover:underline">HOME</Link>
                        <Link to="/about" className="hover:underline">SOBRE NÓS</Link>
                        <Link to="/contact" className="hover:underline">FALE CONOSCO</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell className="h-6 w-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                1
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row">
                <div className="relative w-full h-40 md:h-auto md:w-1/2 bg-[#689689] rounded-b-[50%] md:rounded-none">
                    <img
                        src="./images/predios2.png"
                        alt="Voz Cidadão"
                        className="w-full h-full object-cover object-[center_90%] md:object-center rounded-b-[50%] md:rounded-none"
                    />
                </div>

                <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[--cor-primaria2] font-montserrat">Fale Conosco</h2>
                        </div>

                        <div className="mt-4 space-y-4 font-lato">
                            <p className="text-sm text-gray-600 text-justify">
                                Se você tiver alguma dúvida, sugestão ou reclamação, não hesite em nos contactar. A equipe do Voz Cidadão está pronta para ouvir sua opinião e ajudar no que for necessário para melhorar a nossa cidade.
                            </p>

                            <p className="text-sm text-gray-600 text-justify">
                                Estamos disponíveis para responder às suas mensagens e trabalhar juntos para construir uma cidade mais organizada e bem cuidada. Você pode nos alcançar através das redes sociais ou pelos meios de contato abaixo.
                            </p>

                            {/* icones das redes sociais */}
                            <div className="mt-6 flex justify-center space-x-8">
                                <a href="https://www.instagram.com" target="_blank" className="text-gray-600 hover:text-[--cor-primaria2]">
                                    <FaInstagram size={30} />
                                </a>
                                <a href="https://www.facebook.com" target="_blank" className="text-gray-600 hover:text-[--cor-primaria2]">
                                    <FaFacebookF size={30} />
                                </a>
                                <a href="https://wa.me/55xxxxxxxxx" target="_blank" className="text-gray-600 hover:text-[--cor-primaria2]">
                                    <FaWhatsapp size={30} />
                                </a>
                            </div>

                            <div className="mt-6 text-center">
                                <Link to="/" className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline">
                                    Voltar à página inicial
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
