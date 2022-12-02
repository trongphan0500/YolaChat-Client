import React, { useState, useEffect, useRef, useContext } from "react";
import { Col, Row } from "antd";
import "./style.css";
import ChatViewMessage from "../ChatViewMessage";
import ChatViewInput from "../ChatViewInput";
import axios from "axios";
import {
    sendMessageRoute,
    recieveMessageRoute,
    getMessagesRoom,
} from "../../utils/APIRoutes";
import { AppContext } from "../../context/AppProvider";

export default function ChatView({ socket, currentChat }) {
    const { roomChat, setRoomChat, setCurrentChat, user } =
        useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        async function fetchData() {
            if (currentChat) {
                const data = await JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                );
                const response = await axios.post(recieveMessageRoute, {
                    from: data._id,
                    to: currentChat._id,
                });

                setRoomChat(undefined);
                setMessages(response.data);
            }
        }
        fetchData();
    }, [currentChat]);
    useEffect(() => {
        async function fetchData() {
            if (roomChat) {
                const data = await JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                );
                const response = await axios.post(getMessagesRoom, {
                    id: roomChat.id,
                    from: user._id,
                });

                setCurrentChat(undefined);

                setMessages(response.data);
            }
        }
        fetchData();
    }, [roomChat]);

    useEffect(() => {
        const getCurrentChat = async () => {
            if (currentChat) {
                await JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                )._id;
            }
        };
        getCurrentChat();
    }, [currentChat]);
    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        if (currentChat !== undefined) {
            const data1 = await axios.post(sendMessageRoute, {
                from: data._id,
                to: currentChat._id,
                message: msg,
                namesend: "",
                avatarImage: data.avatarImage,
            });

            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                msg,
                id: data1.data.id,
                avatarImage: data.avatarImage,
            });

            const msgs = [...messages];

            msgs.push({
                id: data1.data.id,
                fromSelf: true,
                message: msg,
                reaction: "",
                from: data._id,
                to: currentChat._id,
                image: "",
                files: null,
                deletedFromSelf: false,
                deletedToAll: false,
            });

            setMessages(msgs);
            // console.log(msgs);
        } else if (roomChat !== undefined) {
            const data1 = await axios.post(sendMessageRoute, {
                from: data._id,
                to: roomChat.id,
                message: msg,
                namesend: data.username,
                avatarImage: data.avatarImage,
                image: "",
                files: null,
            });

            socket.current.emit("send-msg", {
                to: roomChat.members,
                from: data._id,
                msg,
                id: data1.data.id,
                namesend: data.username,
                avatarImage: data.avatarImage,
            });

            const msgs = [...messages];

            msgs.push({
                id: data1.data.id,
                fromSelf: true,
                message: msg,
                reaction: "",
                namesend: data.username,
                avatarImage: data.avatarImage,
            });
            setMessages(msgs);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const getCurenUser = setInterval(() => {
                if (socket.current) {
                    socket.current.on(
                        "msg-recieve",
                        ({
                            id,
                            msg,
                            namesend,
                            avatarImage,
                            files,
                            image,
                            deleteFromSelf,
                            deletedToAll,
                        }) => {
                            if (
                                (files === "" || files === null) &&
                                msg === undefined
                            ) {
                                setArrivalMessage({
                                    fromSelf: false,
                                    message: "",
                                    id: id,
                                    image: image,
                                    files: "",
                                    atarImage: avatarImage,
                                    namesend: namesend,
                                });
                            } else if (msg === undefined && image === "") {
                                // console.log("Send files");
                                setArrivalMessage({
                                    fromSelf: false,
                                    message: "",
                                    image: "",
                                    files: files,
                                    id: id,
                                    atarImage: avatarImage,
                                    namesend: namesend,
                                });
                            } else {
                                // console.log("Send Message");

                                setArrivalMessage({
                                    fromSelf: false,
                                    message: msg,
                                    image: "",
                                    files: "",
                                    id: id,
                                    avatarImage: avatarImage,
                                    namesend: namesend,
                                });
                            }
                        }
                    );
                }
            }, 0);
            return () => clearInterval(getCurenUser);
        }
        fetchData();
    }, []);

    if (socket.current) {
        socket.current.on(
            "msg-deleted",
            ({
                id,
                msg,
                namesend,
                avatarImage,
                files,
                image,
                deletedFromSelf,
                deletedToAll,
            }) => {
                if (deletedToAll) {
                    // console.log(messages);
                    const msgs = [...messages];
                    console.log(msgs);
                    msgs.forEach(function (e, i) {
                        if (e.id === id) {
                            e.message = "Tin nhắn đã được thu hồi";
                            e.image = "Tin nhắn đã được thu hồi";
                            e.files = "Tin nhắn đã được thu hồi";
                        }
                    });
                    // console.log(msgs);
                    setMessages(msgs);
                }
            }
        );
    }
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);
    // useEffect(() => {
    //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);
    return (
        <div className="chat-view">
            <Row>
                <Col span={24}>
                    <ChatViewMessage
                        currentChat={currentChat}
                        socket={socket}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </Col>

                <Col span={24}>
                    <ChatViewInput
                        socket={socket}
                        handleSendMsg={handleSendMsg}
                        currentChat={currentChat}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </Col>
            </Row>
        </div>
    );
}
