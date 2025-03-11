import { Bell, ChevronDown, ChevronUp, LogOut, Menu, User, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import BotaoChamado from '../botaoChamado'
import { useState } from 'react'

function Header() {
    const location = useLocation() 
    const rotasOcultas = ["/dashboard"]

    const [showMenu, setShowMenu] = useState(false);

    const [showConta, setShowConta] = useState(false);
return (
    <header className="bg-[#2B87B3] text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex items-center gap-2">
                <User className="h-8 w-8" />
                <div className="flex flex-col">
                    <span className="text-sm">Nome_cidadão</span>
                    <button className="text-xs hover:underline">
                        <span className="flex items-center gap-1">
                            <LogOut className="h-3 w-3" />
                            <Link to="/signin">Finalizar Sessão</Link>
                        </span>
                    </button>
                </div>
            </div>

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


            <div className="flex items-center gap-4">
                <div className="relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        1
                    </span>
                </div>
            </div>

            {!rotasOcultas.includes(location.pathname) && (
                <BotaoChamado className="bg-[--cor-secundaria4] font-montserrat text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors" />
            )}

            {/* Menu Mobile */}
            <div className="md:hidden">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="font-bold text-xl hover:text-gray-500"
                    >
                        {showMenu ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <aside className={`fixed md:hidden top-0 right-0 h-full w-64 bg-[#2B87B3] text-white flex flex-col items-center justify-center gap-8 z-50 transition-transform transform ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                <button
                    onClick={() => setShowMenu(false)}
                    className="absolute top-5 right-5 text-white text-2xl"
                >
                    <X />
                </button>
                <nav className="flex flex-col items-center gap-6 text-lg justify-center font-montserrat">
                     {/* links da conta */}
                     <div className='flex flex-col items-center'>
                        <button onClick={() => setShowConta(!showConta)} className="flex items-center gap-1 hover:underline">
                            <span>CONTA</span>
                            {showConta ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${showConta ? 'max-h-40' : 'max-h-0'}`}>
                            <nav className='flex flex-col items-center gap-2 mt-2 text-sm'>
                                <Link to="/" className="hover:underline">CONFIGURAÇÕES DA CONTA</Link>
                                <Link to="/signin" className="hover:underline">FINALIZAR SESSÃO</Link>
                            </nav>
                        </div>
                    </div>

                    <Link to="/" className="hover:underline" onClick={() => setShowMenu(false)}>
                        HOME
                    </Link>
                    <Link to="/about" className="hover:underline" onClick={() => setShowMenu(false)}>
                        SOBRE NÓS
                    </Link>
                    <Link to="/contact" className="hover:underline" onClick={() => setShowMenu(false)}>
                        FALE CONOSCO
                    </Link>
                </nav>
            </aside>
    </header>
);
}

export default Header