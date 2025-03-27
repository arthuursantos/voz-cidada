import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "@/components/header";
import { faCamera, faImage, faLocationPin } from "@fortawesome/free-solid-svg-icons";

export default function AbrirChamado() {
  const navigate = useNavigate();
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Dois refs para os inputs: câmera e galeria
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Função para adicionar fotos (garante máximo de 5 imagens)
  const addFotos = (novosArquivos: FileList) => {
    const novos = Array.from(novosArquivos);
    setFotos((prevFotos) => {
      const combinadas = [...prevFotos, ...novos];
      return combinadas.slice(0, 5); // Limita a 5 imagens
    });
  };

  // Handlers para cada input
  const handleCameraChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Para câmera, normalmente somente 1 arquivo é permitido
      addFotos(e.target.files);
    }
  };

  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFotos(e.target.files);
    }
  };

  // Remover uma foto da seleção
  const removeFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validações:
    if (!descricao.trim()) {
      alert("A descrição é obrigatória.");
      return;
    }
    if (!categoria) {
      alert("Selecione uma categoria.");
      return;
    }
    if (fotos.length === 0) {
      alert("Você deve selecionar pelo menos uma foto.");
      return;
    }

    setLoading(true);

    try {
      // Cria o FormData e insere os dados
      const formData = new FormData();
      formData.append("descricao", descricao);
      formData.append("categoria", categoria);
      // Para integração com o backend, usamos somente a primeira foto como "fotoAntesFile"
      formData.append("fotoAntesFile", fotos[0]);
      // Se for necessário enviar mais informações (como usuário, latitude, etc.), adicione aqui

      const response = await fetch("/api/chamado/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Chamado registrado com sucesso!");
        navigate("/chamados");
      } else {
        const errorData = await response.json();
        alert(
          "Erro ao registrar chamado: " +
            (errorData.message || "Tente novamente")
        );
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro de rede ao registrar o chamado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6 relative">
        <div className="mb-4">
          <button
            className="text-orange-500 text-3xl"
            onClick={() => navigate(-1)}
          >
            &#8592;
          </button>
        </div>

        <h1
          className="text-center text-2xl font-bold mb-6 underline"
          style={{ color: "#1D2F5D" }}
        >
          REGISTRAR O CHAMADO
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Campo de Descrição */}
          <div className="mb-7">
            <label
              className="block text-white bg-[#2B87B3] px-4 py-1 rounded-xl w-full mb-2"
              htmlFor="descricao"
            >
              Descrição:
            </label>
            <textarea
              id="descricao"
              className="w-full border-2 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o motivo do chamado"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          {/* Seleção de Categoria */}
          <div className="mb-14">
            <label
              className="block text-white bg-[#2B87B3] px-4 py-1 rounded-xl w-full mb-2"
              htmlFor="categoria"
            >
              Selecione a Categoria:
            </label>
            <select
              id="categoria"
              className="w-full border-2 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione o tipo do chamado...</option>
              <option value="iluminacao">Recolhimento de entulho</option>
              <option value="vias">Jardinagem de praças</option>
              <option value="saneamento">
                Jardinagem de praças ou áreas públicas
              </option>
              <option value="vias">Manutenção de vias públicas</option>
              <option value="vias">
                Manutenção de rede de iluminação em praças e avenidas
              </option>
            </select>
          </div>

          {/* Inputs ocultos para câmera e galeria */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            ref={cameraInputRef}
            style={{ display: "none" }}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            ref={galleryInputRef}
            style={{ display: "none" }}
          />

          {/* Exibição das fotos selecionadas */}
          <div className="mb-6">
            <label
              className="block text-white bg-[#2B87B3] px-4 py-1 rounded-xl w-full mb-2"
              htmlFor="fotos"
            >
              Fotos Selecionadas (mínimo 1, até 5):
            </label>
            {fotos.length > 0 ? (
              <ul className="mt-2">
                {fotos.map((foto, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm">{foto.name}</span>
                    <button
                      type="button"
                      className="text-red-500 text-xs"
                      onClick={() => removeFoto(index)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm mt-2">Nenhuma foto selecionada</p>
            )}
          </div>

          {/* Ícones de Câmera, Galeria e Localização */}
          <div className="flex justify-center gap-x-12 my-6 mb-20">
  <div className="flex flex-col items-center cursor-pointer">
    <div
      className="border-2 border-gray-200 p-4 rounded-lg flex justify-center items-center"
      style={{ width: "90px", height: "90px", borderRadius: "12px" }}
      onClick={() => cameraInputRef.current?.click()}
    >
      <FontAwesomeIcon icon={faCamera} className="text-pink-500 text-3xl" />
    </div>
    <p className="text-sm mt-2">Câmera</p>
  </div>
  <div className="flex flex-col items-center cursor-pointer">
    <div
      className="border-2 border-gray-200 p-4 rounded-lg flex justify-center items-center"
      style={{ width: "90px", height: "90px", borderRadius: "12px" }}
      onClick={() => galleryInputRef.current?.click()}
    >
      <FontAwesomeIcon icon={faImage} className="text-pink-500 text-3xl" />
    </div>
    <p className="text-sm mt-2">Galeria</p>
  </div>
  <div className="flex flex-col items-center cursor-pointer">
    <div
      className="border-2 border-gray-200 p-4 rounded-lg flex justify-center items-center"
      style={{ width: "90px", height: "90px", borderRadius: "12px" }}
      // Se desejar, pode implementar outra funcionalidade para localização
    >
      <FontAwesomeIcon icon={faLocationPin} className="text-pink-500 text-3xl" />
    </div>
    <p className="text-sm mt-2">Localização</p>
  </div>
</div>


          {/* Botão de Envio */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`bg-purple-600 font-bold hover:bg-purple-700 text-white px-12 py-2 rounded-lg ${loading && "opacity-50 cursor-not-allowed"}`}
              disabled={loading}
            >
              {loading ? "Enviando..." : "ENVIAR"}
            </button>
          </div>
        </form>
      </div>
      

      {/* Nuvens decorativas no rodapé */}
      <div className="pointer-events-none">
        <div className="absolute bottom-0 left-0">
          <img
            src="./images/NuvemEsquerda.png"
            alt="Nuvem Esquerda"
            style={{ width: "450px", height: "auto" }}
          />
        </div>
        <div className="absolute bottom-0 right-0">
          <img
            src="./images/NuvemDireita.png"
            alt="Nuvem Direita"
            style={{ width: "450px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
