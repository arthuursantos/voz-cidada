import Header from "@/components/header";

export default function AbrirChamado() {
  return (
    <div className="relative min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6 relative">

        <div className="mb-4">
          <button className="text-orange-500 text-3xl">
            &#8592;
          </button>
        </div>

        <h1 className="text-center text-2xl font-bold mb-6 underline" style={{ color: '#1D2F5D' }}>
          REGISTRE O CHAMADO
        </h1>

        <div >        {/* Formulario */}
          {/* Descrição */}
          <div className="mb-7">
            <label
              className="block text-white bg-[#2B87B3] px-4 py-1 rounded-xl w-full mb-2"
            >
              Descrição:
            </label>
            <textarea
              className="w-full border-2 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição do chamado"
              rows={4}
            ></textarea>
          </div>

          {/* Seleção de Categoria */}
          <div className="mb-14">
            <label className="block text-white bg-[#2B87B3] px-4 py-1 rounded-xl w-full mb-2">
              Selecione a Categoria:
            </label>
            <select className="w-full border-2 rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione o tipo do chamado...</option>
              <option value="iluminacao">Iluminação Pública</option>
              <option value="vias">Problemas em Vias</option>
              <option value="saneamento">Saneamento</option>
            </select>
          </div>



          {/* Ícones de Câmera, Galeria e Localização */}
          <div className="flex justify-center gap-x-12 my-6 mb-20
           ">

            <div className="flex flex-col items-center cursor-pointer">
              <div
                className="border-2 border-gray-200 p-4 rounded-lg flex justify-center items-center"
                style={{
                  width: '90px',  
                  height: '90px', 
                  borderRadius: '12px',  
                }}
              >
                <span role="img" aria-label="camera" className="text-pink-500 text-3xl">
                  📷
                </span>
              </div>
              <p className="text-sm mt-2">Câmera</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer ">
              <div
                className="border-2 border-gray-200 p-4 rounded-lg flex justify-center items-center"
                style={{
                  width: '90px',  
                  height: '90px',
                  borderRadius: '12px',  
                }}
              >
                <span role="img" aria-label="gallery" className="text-pink-500 text-3xl">
                  🖼
                </span>
              </div>
              <p className="text-sm mt-2">Galeria</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <div
                className="border-2 border-gray-200 p-4 rounded-lg flex justify-center items-center"
                style={{
                  width: '90px', height: '90px', borderRadius: '12px',  
                }}>
                <span role="img" aria-label="location" className="text-pink-500 text-3xl">
                  📍
                </span>
              </div>
              <p className="text-sm mt-2">Localização</p>
            </div>

          </div>

          {/*botao de envio*/}
          <div className="flex justify-center mt-6">
            <button
              className="bg-purple-600 font-bold hover:bg-purple-700 text-white px-12 py-2 rounded-lg"
            >
              ENVIAR
            </button>
          </div>
        </div>
      </div>

      {/* Nuvens decorativas no rodapé */}
      <div className="pointer-events-none">
        <div className="absolute bottom-0 left-0">
          <img
            src="./images/NuvemEsquerda.png"
            alt="Nuvem Esquerda"
            style={{
              width: '450px',  
              height: 'auto',  
            }} />
        </div>
        <div className="absolute bottom-0 right-0">
          <img
            src="./images/NuvemDireita.png"
            alt="Nuvem Direita"
            style={{
              width: '450px',  
              height: 'auto',  
            }}
          />
        </div>
      </div>
    </div>
  );
}

{/*<div className="absolute bottom-0 left-0">
          <img
            src="./images/NuvemEsquerda.png"
            alt="Nuvem Esquerda"
            className="w-full h-auto"
          />
        </div>*/}
