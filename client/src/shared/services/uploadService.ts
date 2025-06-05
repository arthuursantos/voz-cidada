import api from '@/shared/axios.ts'

const uploadService = {

    getImage: (filename: string) => {
        return api.get(`/api/upload/${filename}`, {
            responseType: 'blob'
        });
    },

    createWithImage: (data: FormData) => {
        return api.post('/api/upload/chamado', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    saveImage: (data: FormData): Promise<string> => {
        return api.post('/api/upload/file', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

};

export default uploadService;