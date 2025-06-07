import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import Header from "@/components/header";

const Contact = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header/>

            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="relative w-full h-40 md:h-auto md:w-1/2  rounded-b-[50%] md:rounded-none">
                    <img
                        src="./images/predios2.png"/*imagem */
                        alt="Voz Cidadão"
                        className="w-full h-full object-cover object-[center_90%] md:object-center rounded-b-[50%] md:rounded-none"
                    />
                </div>

                <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[--cor-primaria2] font-montserrat lg:text-4xl">Fale Conosco</h2>
                        </div>

                        <div className="mt-4 space-y-4 C">
                            <p className="text-md text-gray-600 text-justify lg:text-base">
                                Se você tiver alguma dúvida, sugestão ou reclamação, não hesite em nos contactar. A equipe do Voz Cidadão está pronta para ouvir sua opinião e ajudar no que for necessário para melhorar a nossa cidade.
                            </p>

                            <p className="text-md text-gray-600 text-justify lg:text-base">
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
