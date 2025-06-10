import api from "@/shared/axios.ts";

const notificationService = {

    setToken: (fcmToken: string) => {
        return api.post('api/notification/setToken', fcmToken);
    },

    sendToUser: (data: {
        title: string;
        body: string;
        token: string;
    }) => {
        return api.post('api/notification/sendToUser', data);
    },

};

export default notificationService;