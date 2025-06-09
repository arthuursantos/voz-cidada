import { messaging, getToken, onMessage } from '../firebase-config';
import notificationService from "@/shared/services/notificationService.ts";

export const initializeFirebaseMessaging = (accessToken: string) => {
        if (!accessToken) return;
        // Solicitar permissão para notificações
        const requestPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                    await getAndSendToken();
                } else {
                    console.log('Unable to get permission to notify.');
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        };

        // Obter e enviar token para o backend
        const getAndSendToken = async () => {
            try {
                const currentToken = await getToken(messaging, {
                    vapidKey: 'BEfW3IXFYmtQi3T0dCXnQO-Fty4YcoxI-75AyhJmdwcsYO-_GvTuZsWpkM7kEkeWq9Pdu731JKoZb8Vb7VNTpwU'
                });

                if (currentToken) {
                    console.log('FCM Token:', currentToken);
                    await sendTokenToBackend(currentToken);
                } else {
                    console.log('No registration token available.');
                }
            } catch (error) {
                console.error('An error occurred while retrieving token:', error);
            }
        };

        // Enviar token para o backend
        const sendTokenToBackend = async (token: string) => {
            try {
                notificationService.setToken(token);
                console.log('Token successfully sent to backend');
            } catch (error) {
                console.error('Error sending token to backend:', error);
            }
        };

        // Lidar com mensagens recebidas em primeiro plano
        const setupForegroundMessageHandler = () => {
            onMessage(messaging, (payload) => {
                console.log('Message received in foreground:', payload);
            });
        };

        requestPermission();
        setupForegroundMessageHandler();

    };