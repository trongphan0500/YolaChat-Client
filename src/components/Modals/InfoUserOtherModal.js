import React, { useContext } from "react";
import { Avatar, Button, Image, Modal } from "antd";
import { AppContext } from "../../context/AppProvider";
import bg_user_default from "../../assets/images/bg_user_default.jfif";
import {
    DeleteOutlined,
    EditOutlined,
    StopOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import "./style.css";
import axios from "axios";
import {
    unFriend,
    getUserByPhoneNumber,
    checkSendedRequestAddFriend,
    host,
} from "../../utils/APIRoutes";
import { io } from "socket.io-client";
import { useRef } from "react";

export default function InfoUserOtherModal() {
    const {
        isInfoUserOtherModalOpen,
        setIsInfoUserOtherModalOpen,
        currentSearch,
        setCurrentSearch,
        listCurrentFriend,
        setSendedRequst,
        phoneNumber,
        setPhoneNumber,
        currentUser,
        currentChat,
        getCurrentFriend,
        setListCurrentFriend,
        setCurrentChat,
        roomChat,
        setListWait,
        sendedRequest,
    } = useContext(AppContext);
    const socket = useRef();

    const handleCancel = () => {
        setIsInfoUserOtherModalOpen(false);
        setListWait([]);
    };

    const user = {
        displayName: "Trần Nguyễn Kha Vỹ",
        photoURL: "",
        phoneNumber: "0986504217",
        gender: "Nam",
        birthday: "30 tháng 4, 2001",
        isFriend: false,
        generalGroup: 3,
    };
    const handleAddOrUnFriend = async () => {
        const listCurrentFriendPhone = [];
        listCurrentFriend.map((m, i) => {
            listCurrentFriendPhone.push(m.phonenumber);
        });

        if (listCurrentFriendPhone.indexOf(phoneNumber) === -1) {
            return true;
        }
        return false;
    };

    const checkSendedReuestFriend = async () => {
        const checkSended = await axios.post(checkSendedRequestAddFriend, {
            senderId: currentUser.phonenumber,
            received: phoneNumber,
        });
        setSendedRequst(checkSended.data);
        console.log(sendedRequest);
        if (sendedRequest === undefined || sendedRequest === "") return false;
        return sendedRequest;
    };

    const handleUnFriend = async () => {
        console.log("UnFriend");

        if (phoneNumber === "" || phoneNumber === null) {
            const userByPhoneNumber = await axios.post(getUserByPhoneNumber, {
                phoneNumber: currentChat.phonenumber,
            });
            const res = await axios.post(unFriend, {
                received: userByPhoneNumber.data.data[0]._id,
                receivedPhoneNumber: userByPhoneNumber.data.data[0].phonenumber,
                senderId: currentUser._id,
                senderPhoneNumber: currentUser.phonenumber,
            });
            setListCurrentFriend(res.data.data);
            socket.current = io(host);
            socket.current.emit("unfriend", {
                to: userByPhoneNumber.data.data[0]._id,
            });
            console.log(res.data.data2);
            setSendedRequst(res.data.data2);
        } else {
            const userByPhoneNumber = await axios.post(getUserByPhoneNumber, {
                phoneNumber: phoneNumber,
            });
            const res = await axios.post(unFriend, {
                received: userByPhoneNumber.data.data[0]._id,
                receivedPhoneNumber: userByPhoneNumber.data.data[0].phonenumber,
                senderId: currentUser._id,
                senderPhoneNumber: currentUser.phonenumber,
            });
        }

        setCurrentChat(undefined);
        alert("Hủy kết bạn thành công");
        handleCancel();
    };

    const handleInfoUser = () => {
        console.log("alo");
    };

    return (
        <div>
            <Modal
                title="Thông tin tài khoản"
                centered // căn giữa
                open={isInfoUserOtherModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <div>
                    {currentSearch.map((m) => {
                        return (
                            <div>
                                <div className="md-info-user-header user-other">
                                    <Image
                                        className="md-info-user-img"
                                        src={
                                            user.photoURL
                                                ? user.photoURL
                                                : bg_user_default
                                        }
                                    />
                                    <Avatar
                                        className="md-info-user-avt"
                                        size={70}
                                        src={m.avatarImage}
                                    >
                                        {user.photoURL
                                            ? ""
                                            : user.displayName
                                                  ?.charAt(0)
                                                  ?.toUpperCase()}
                                    </Avatar>
                                    <div className="chat-room-info-body-btn-name">
                                        <span
                                            style={{
                                                marginLeft: "2rem",
                                            }}
                                        >
                                            {m.username}
                                        </span>
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                        />
                                    </div>
                                    <div className="user-orther-btn">
                                        {handleAddOrUnFriend() === true ? (
                                            <Button type="text">Kết bạn</Button>
                                        ) : (
                                            <Button
                                                onClick={handleUnFriend}
                                                type="text"
                                            >
                                                Hủy kết bạn
                                            </Button>
                                        )}
                                        <Button type="text">Nhắn tin</Button>
                                    </div>
                                </div>
                                <div className="md-info-user-body user-other user-other-body">
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Thông tin cá nhân
                                    </span>
                                    <div className="md-info-user-body-bd">
                                        <div className="md-info-user-body-bd-1">
                                            <span>Điện thoại</span>
                                            <span>Giới tính</span>
                                            <span>Ngày sinh</span>
                                        </div>
                                        <div className="md-info-user-body-bd-2">
                                            <span>{m.phonenumber}</span>
                                            <span>
                                                {m.gender ? "Nam" : "Nữ"}
                                            </span>
                                            <span>{m.DateOfBirth}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-other-footer">
                                    <Button type="text" icon={<TeamOutlined />}>
                                        Nhóm chung ({user.generalGroup})
                                    </Button>
                                    <Button type="text" icon={<StopOutlined />}>
                                        Chặn tin nhắn
                                    </Button>
                                    {user.isFriend ? (
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                        >
                                            Xóa khỏi danh sách bạn bè
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
}
