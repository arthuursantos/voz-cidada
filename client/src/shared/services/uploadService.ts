import api from '@/shared/axios.ts'

interface UploadResponse {
    data: string; // ou o tipo correto da URL retornada
    // outras propriedades da resposta se necessário
  }

const uploadService = {

    getImage: (filename: string) => {
        return api.get(`/api/upload/${filename}`, {
            responseType: 'blob'
        });
    },

    saveImage: (data: FormData): Promise<UploadResponse> => {
        return api.post('/api/upload/file', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

};

export default uploadService;