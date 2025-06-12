import api from "@/shared/axios.ts";

const notificationService = {

    setToken: (fcmToken: string) => {
        return api.post('/notification/setToken', fcmToken);
    },

    sendToUser: (data: {
        title: string;
        message: string;
        authUserId: number;
    }) => {
        return api.post('/notification/sendToUser', data);
    },

};

export default notificationService;