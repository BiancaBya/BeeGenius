import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage, Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

export const useWebSocket = (userId: string | null) => {
    const stompClientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<any>(null);

    useEffect(() => {
        if (!userId || stompClientRef.current?.connected) return;

        const backendURL = process.env.REACT_APP_BACKEND_WS_URL as string;
        const socket = new SockJS(backendURL);
        const stompClient = Stomp.over(() => socket);
        stompClient.reconnect_delay = 0;

        stompClient.connect({}, () => {
            console.log(`Connected to WebSocket for user ${userId}`);


            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

            subscriptionRef.current = stompClient.subscribe(`/topic/book-request/user/${userId}`, (message: IMessage) => {
                if (message.body) {
                    toast.info(message.body, {
                        position: "bottom-right",
                        autoClose: 5000,
                    });
                }
            });
        });

        stompClientRef.current = stompClient;

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.deactivate().then(() => {
                    console.log("WebSocket disconnected");
                });
            }
        };
    }, [userId]);
};
