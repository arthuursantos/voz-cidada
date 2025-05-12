import api from '@/shared/axios.ts'

const uploadService = {

    getImage: (filename: string) => {
        return api.get(`/api/chamado/upload/${filename}`, {
            responseType: 'blob'
        });
    },

    createWithImage: (data: FormData) => {
        return api.post('/api/chamado/upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

};

export default uploadService;