import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import notificationService from "@/shared/services/notificationService.ts";
import {toast} from "react-hot-toast";

const firebaseConfig = {
    apiKey: "AIzaSyD8hGCL-jDEiWJYd0PbWYPpYtF-VNt7n24",
    authDomain: "fir-3mod25.firebaseapp.com",
    projectId: "fir-3mod25",
    storageBucket: "fir-3mod25.firebasestorage.app",
    messagingSenderId: "769227253844",
    appId: "1:769227253844:web:a57702ba8f9aca555925c1",
    measurementId: "G-099LW1PGZ9"
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const myGetToken = (setTokenFound: (arg0: boolean) => void) => {
    return getToken(messaging, {vapidKey: 'BEfW3IXFYmtQi3T0dCXnQO-Fty4YcoxI-75AyhJmdwcsYO-_GvTuZsWpkM7kEkeWq9Pdu731JKoZb8Vb7VNTpwU'}).then((currentToken) => {
        if (currentToken) {
            setTokenFound(true);
            notificationService.setToken(currentToken)
        } else {
            setTokenFound(false);
        }
    })
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            const messageBody = payload.notification?.body ?? "Nova notificação recebida";
            toast.success(messageBody, {
                duration: 4000,
                position: "top-center",
            })
            resolve(payload);
        });
    });