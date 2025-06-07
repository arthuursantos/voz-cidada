import { Bell, ChevronDown, ChevronUp, LogOut, Menu, User, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import BotaoChamado from '../botaoChamado'
import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

function Header() {
    const { isGoogleUser, user, admin, isAuthenticated, signOut, userProfilePicture } = useContext(AuthContext)
    const location = useLocation() 
    const rotasOcultas = ["/dashboard", "/admin/dashboard", "/funcionario/dashboard", "/funcionario/historico", "/funcionario/profile",]
    const [showMenu, setShowMenu] = useState(false)
    const [showConta, setShowConta] = useState(false)

    return (
        <header className="bg-[--cor-primaria2] text-white p-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo/Title - Mobile */}
                <div className=" md:hidden flex items-center">
                    <Link to="/" className="text-lg font-bold flex items-center">
                        <img src="./images/favicon.png" className='w-6' />
                        <span className="ml-2">Voz Cidadã</span>
                    </Link>
                </div>

                {/* Conta - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    {isGoogleUser ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                            <img 
                                src={userProfilePicture || ""} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    ) : <User className="h-8 w-8" />}
                    <div className="flex flex-col">
                        <Link to="/conta">
                            <span className="text-sm hover:underline">
                                {isAuthenticated ? (user ? user.nome : admin ? admin.cargo : "Nome_Cidadao") : "Nome_Cidadao"}
                            </span>
                        </Link>
                        <button 
                            className="text-xs hover:underline flex items-center gap-1"
                            onClick={signOut}
                        >
                            <LogOut className="h-3 w-3" />
                            Finalizar Sessão
                        </button>
                    </div>
                </div>
                
                {/* Navegação - Desktop */}
                {(location.pathname !== "/admin/dashboard" && location.pathname !== "/funcionario/dashboard") && (
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="hover:underline font-montserrat">
                            HOME
                        </Link>
                        <Link to="/about" className="hover:underline font-montserrat">
                            SOBRE NÓS
                        </Link>
                        <Link to="/contact" className="hover:underline font-montserrat">
                            FALE CONOSCO
                        </Link>
                    </nav>
                )}

                {/* Ícones e Botões */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Bell className="h-6 w-6 cursor-pointer" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            1
                        </span>
                    </div>

                    {!rotasOcultas.includes(location.pathname) && (
                        <Link to={'/dashboard'} className="hidden md:block">
                            <BotaoChamado className="bg-[--cor-secundaria4] font-montserrat text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors" />
                        </Link>
                    )}

                    {/* Botão Menu Mobile */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="md:hidden font-bold text-xl hover:text-gray-500"
                    >
                        {showMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menu Mobile */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${showMenu ? 'visible' : 'invisible'}`}>
                {/* Overlay */}
                <div 
                    className={`absolute inset-0 bg-black/50 transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setShowMenu(false)}
                />
                
                {/* Conteúdo do Menu */}
                <aside className={`absolute top-0 right-0 h-full w-64 bg-[#2B87B3] text-white flex flex-col transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 flex flex-col h-full">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowMenu(false)}
                                className="text-white p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center gap-8">
                            {/* Seção Conta */}
                            <div className='flex flex-col items-center w-full'>
                                <button 
                                    onClick={() => setShowConta(!showConta)} 
                                    className="flex items-center gap-2 hover:underline w-full justify-center py-2"
                                >
                                    {isGoogleUser ? (
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
                                            <img 
                                                src={userProfilePicture || ""} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                    ) : <User size={20} />}
                                    <span className="font-medium">CONTA</span>
                                    {showConta ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <div className={`w-full overflow-hidden transition-all duration-300 ${showConta ? 'max-h-40' : 'max-h-0'}`}>
                                    <nav className='flex flex-col items-center gap-4 py-2 text-sm'>
                                        <Link 
                                            to="/conta" 
                                            className="hover:underline w-full text-center py-1"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            CONFIGURAÇÕES
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                signOut()
                                                setShowMenu(false)
                                            }} 
                                            className="hover:underline w-full py-1 flex items-center justify-center gap-1"
                                        >
                                            <LogOut size={14} />
                                            FINALIZAR SESSÃO
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* Links de Navegação */}
                            <nav className="flex flex-col items-center gap-6 w-full">
                                <Link 
                                    to="/" 
                                    className="hover:underline w-full text-center py-2 border-b border-white/20"
                                    onClick={() => setShowMenu(false)}
                                >
                                    HOME
                                </Link>
                                <Link 
                                    to="/about" 
                                    className="hover:underline w-full text-center py-2 border-b border-white/20"
                                    onClick={() => setShowMenu(false)}
                                >
                                    SOBRE NÓS
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="hover:underline w-full text-center py-2 border-b border-white/20"
                                    onClick={() => setShowMenu(false)}
                                >
                                    FALE CONOSCO
                                </Link>
                            </nav>

                            {/* Botão Dashboard - Mobile */}
                            {!rotasOcultas.includes(location.pathname) && (
                                <Link 
                                    to={'/dashboard'} 
                                    className="w-full max-w-xs mt-4"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <BotaoChamado className="bg-[--cor-secundaria4] font-montserrat text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors w-full" />
                                </Link>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </header>
    )
}

export default Header