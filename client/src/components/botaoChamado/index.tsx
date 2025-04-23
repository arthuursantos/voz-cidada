function BotaoChamado(props: {className?: string; onClick?: () => void}) {
  const stylePadrao = "bg-[--cor-secundaria4] font-montserrat text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"

return (
  <button 
    className={props.className ? props.className : stylePadrao}
    onClick={props.onClick}
  >
    ABRIR CHAMADO
  </button>
)
}

export default BotaoChamado