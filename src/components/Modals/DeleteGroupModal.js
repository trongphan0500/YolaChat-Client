import React, { useContext } from "react";
import { Modal } from "antd";
import { AppContext } from "../../context/AppProvider";
import "./style.css";
import { deleteRoom } from "../../utils/APIRoutes";
import axios from "axios";
export default function DeleteGroupModal() {
    const {
        isDeleteGroupModalOpen,
        setIsDeleteGroupModalOpen,
        roomChat,
        setRoomChat,
        rooms,
        setRooms,
    } = useContext(AppContext);

    const handleOk = async () => {
        // Xóa nhóm và xóa tin nhắn
        const roomsTam = [...rooms];
        const index = roomsTam.indexOf(roomChat);
        roomsTam.splice(index, 1);
        const respon = await axios.post(deleteRoom, {
            id: roomChat.id,
        });
        setRooms(roomsTam);
        setRoomChat(undefined);
        setIsDeleteGroupModalOpen(false);
    };

    const handleCancel = () => {
        setIsDeleteGroupModalOpen(false);
    };

    return (
        <div>
            <Modal
                title="Giải tán nhóm"
                centered
                open={isDeleteGroupModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                cancelText="Không"
                okText="Giải tán nhóm"
            >
                <span style={{ fontSize: "16px" }}>
                    Mời tất cả mọi người rời nhóm và xóa tin nhắn? <br />
                    Nhóm đã giải tán sẽ KHÔNG THỂ khôi phục.
                </span>
            </Modal>
        </div>
    );
}
