import {
    BellOutlined,
    EditOutlined,
    PushpinOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    DeleteOutlined,
    ExportOutlined,
    BarsOutlined,
    CloseSquareOutlined,
    UserAddOutlined,
    LeftOutlined,
} from "@ant-design/icons";
import { MdGroupOff } from "react-icons/md";
import { Avatar, Button, Image, Menu, Dropdown } from "antd";
import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import { AppContext } from "../../context/AppProvider";
import axios from "axios";
import { updateManager, addTT, blockChat } from "../../utils/APIRoutes";
import { async } from "@firebase/util";
export default function ChatRoomInfo() {
    const [isformTV, setForm] = useState(false);
    const {
        setIsAddUserModalOpen,
        roomChat,
        isShowInfoRoom,
        setShowInfoRoom,
        contacts,
        user,
        setIsLogoutChatRoomModalOpen,
        setIsRenameGroupModalOpen,
        setIsAddMemberModalOpen,
        setIsInfoGroupModalOpen,
        setIsDeleteChatHistoryModalOpen,
        setIsDeleteGroupModalOpen,
        setRoomChat,
        rooms,
        setRooms,
    } = useContext(AppContext);

    const [memclick, setclick] = useState();
    const [dsTV, setDSTV] = useState([]);
    useEffect(() => {
        const ds = [user];
        if (roomChat !== undefined) {
            contacts.forEach((element) => {
                if (roomChat.members.indexOf(element._id) >= 0) {
                    ds.push(element);
                }
            });
            setDSTV(ds);
        }
    }, []);
    const onclickTV = (e) => {
        setclick(e);
    };
    const handleOpenInfo = () => {};

    function getItem(label, key, children) {
        return {
            key,
            children,
            label,
        };
    }
    const handleAddMember = () => {
        setIsAddMemberModalOpen(true);
    };

    const handleInfoGroup = () => {
        setIsInfoGroupModalOpen(true);
    };

    const handleRenameGroup = () => {
        setIsRenameGroupModalOpen(true);
    };

    const handleLogoutChatRoom = () => {
        setIsLogoutChatRoomModalOpen(true);
    };

    const handleDeleteChatHistory = () => {
        setIsDeleteChatHistoryModalOpen(true);
    };

    const handleDeleteGroup = () => {
        setIsDeleteGroupModalOpen(true);
    };

    const handleaddUser = () => {
        setIsAddUserModalOpen(true);
    };

    const memberItems = [
        getItem(
            <span className="chat-room-info-body-mn">Thành viên nhóm</span>,
            "sub1"
        ),
    ];
    const imgItems = [
        getItem(<span className="chat-room-info-body-mn">Ảnh</span>, "sub1", [
            getItem(
                <Image.PreviewGroup>
                    <Image
                        width={50}
                        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    />
                    <Image
                        width={50}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    />
                </Image.PreviewGroup>,
                "1"
            ),
        ]),
    ];
    const handleNhuong = async () => {
        const { respon } = await axios.post(updateManager, {
            id: roomChat.id,
            idManager: memclick._id,
        });

        const roomChatTam = {
            id: roomChat.id,
            createAt: roomChat.createAt,
            manager: memclick._id,
            roomName: roomChat.roomName,
            members: roomChat.members,
            blockChat: roomChat.blockChat,
        };
        setRoomChat(roomChatTam);
    };
    const handleXoa = async () => {
        const memsTam = [...roomChat.members];

        memsTam.splice(memsTam.indexOf(memclick._id), 1);

        const roomChatTam = {
            id: roomChat.id,
            createAt: roomChat.createAt,
            manager: roomChat.manager,
            roomName: roomChat.roomName,
            members: memsTam,
            blockChat: roomChat.blockChat,
        };
        const roomsTam = [...rooms];
        roomsTam.splice(rooms.indexOf(roomChat), 1, roomChatTam);

        setRooms(roomsTam);
        console.log(memsTam);
        const { respon } = await axios.post(addTT, {
            id: roomChat.id,
            mems: memsTam,
        });
        setRoomChat(roomChatTam);
    };
    const [moChat, setMoChat] = useState(true);
    const block = async () => {
        if (roomChat.blockChat.indexOf(memclick._id) < 0) {
            const blockTam = [...roomChat.blockChat];
            blockTam.push(memclick._id);

            setMoChat(false);
            const roomTam = {
                id: roomChat.id,
                createAt: roomChat.createAt,
                manager: roomChat.manager,
                roomName: roomChat.roomName,
                members: roomChat.members,
                blockChat: blockTam,
            };
            setRoomChat(roomTam);
            try {
                const { respon } = await axios.post(blockChat, {
                    id: roomChat.id,
                    blocks: blockTam,
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            const blockTam = [...roomChat.blockChat];
            blockTam.splice(roomChat.blockChat.indexOf(memclick._id), 1);

            setMoChat(true);
            const roomTam = {
                id: roomChat.id,
                createAt: roomChat.createAt,
                manager: roomChat.manager,
                roomName: roomChat.roomName,
                members: roomChat.members,
                blockChat: blockTam,
            };
            setRoomChat(roomTam);
            try {
                const { respon } = await axios.post(blockChat, {
                    id: roomChat.id,
                    blocks: blockTam,
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    // const ktraBlock = async (e)  =>
    // {
    //   if(roomChat.blockChat.indexOf(memclick._id)<0)
    //   {

    //     return true
    //   }
    //   else{
    //     console.log(roomChat.blockChat.indexOf(memclick._id));
    //     return false
    //   }

    // }

    const settingItems = [
        getItem(
            <span className="chat-room-info-body-mn">Thiết lập</span>,
            "sub1",
            [
                getItem(
                    <Button
                        className="chat-room-info-btn-setting"
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteChatHistory}
                    >
                        Xóa lịch sử trò chuyện
                    </Button>,
                    "1"
                ),
                getItem(
                    <Button
                        className="chat-room-info-btn-setting"
                        type="text"
                        icon={<ExportOutlined />}
                        onClick={handleLogoutChatRoom}
                    >
                        Rời nhóm
                    </Button>,
                    "2"
                ),
                getItem(
                    <>
                        {roomChat === undefined ? (
                            <></>
                        ) : (
                            <>
                                {user._id === roomChat.manager ? (
                                    <Button
                                        className="chat-room-info-btn-setting"
                                        type="text"
                                        icon={<CloseSquareOutlined />}
                                        onClick={handleDeleteGroup}
                                    >
                                        Giải tán nhóm
                                    </Button>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </>
                ),
            ]
        ),
    ];

    const items = [
        {
            label: "sub menu",
            key: "submenu",
            children: [{ label: "item 3", key: "submenu-item-1" }],
        },
    ];
    const menu = (
        <Menu>
            <Menu.Item>
                <div onClick={handleNhuong}> Nhường nhóm trưởng </div>
            </Menu.Item>
            <Menu.Item>
                <div onClick={handleXoa}> Xóa khỏi nhóm </div>
            </Menu.Item>
            <Menu.Item>
                <div onClick={block}>
                    {memclick !== undefined ? (
                        <div>
                            {roomChat.blockChat.indexOf(memclick._id) < 0 ? (
                                <div>Cấm chat</div>
                            ) : (
                                <div>Mở chat</div>
                            )}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            {isformTV === false ? (
                <div className="chat-room-info">
                    <div className="chat-room-info-header">
                        <span></span>
                        <span>Thông tin nhóm</span>
                        <span></span>
                    </div>
                    <div className="chat-room-info-body">
                        {/* <div className="chat-room-info-body-btn">
          
            <>{roomChat === undefined ? (<div></div>):(<div>
              <Button className="info-avatar-user" type="text">
              <Avatar size="large" src={roomChat.photoURL} onClick={handleOpenInfo}>
              {user.photoURL ? "" : roomChat.roomName?.charAt(0)?.toUpperCase()}
              </Avatar>
              </Button>
              <span>
                {roomChat.roomName} <Button type="text" icon={<EditOutlined />} />
              </span>
              </div>)}
            </>
          
          
          <div>
            <div>
              <Button type="text" icon={<BellOutlined />} />
              <span>Tắt thông báo</span>
            </div>
            <div>
              <Button type="text" icon={<PushpinOutlined />} />
              <span>Ghim hội thoại</span>
            </div>
            <div>
              <Button type="text" icon={<UsergroupAddOutlined />} />
              <span>Thêm thành viên</span>
            </div>
            <div>
              <Button type="text" icon={<SettingOutlined />} />
              <span>Quản lý nhóm</span>
              
            </div>
            
          </div>
          
          
        </div> */}
                        <>
                            {roomChat === undefined ? (
                                <div></div>
                            ) : (
                                <div>
                                    <div className="chat-room-info-body-btn chat-room-info-body-body">
                                        <Button
                                            className="chat-room-info-body-btn-avatar"
                                            type="text"
                                            icon={
                                                <Avatar size={70}>
                                                    {1 !== 1
                                                        ? ""
                                                        : roomChat.roomName
                                                              ?.charAt(0)
                                                              ?.toUpperCase()}
                                                </Avatar>
                                            }
                                        ></Button>
                                        <div className="chat-room-info-body-btn-name">
                                            <span>{roomChat.roomName}</span>
                                            <Button
                                                type="text"
                                                onClick={handleRenameGroup}
                                                icon={<EditOutlined />}
                                            />
                                        </div>
                                        <div className="chat-room-info-body-btn-group">
                                            <div>
                                                <Button
                                                    type="text"
                                                    icon={<BellOutlined />}
                                                />
                                                <span>Tắt thông báo</span>
                                            </div>
                                            <div>
                                                <Button
                                                    type="text"
                                                    icon={<PushpinOutlined />}
                                                />
                                                <span>Ghim hội thoại</span>
                                            </div>
                                            <div>
                                                <Button
                                                    type="text"
                                                    handleaddUser
                                                    onClick={() =>
                                                        handleaddUser()
                                                    }
                                                    icon={
                                                        <UsergroupAddOutlined />
                                                    }
                                                />
                                                <span>Thêm thành viên</span>
                                            </div>
                                            <div>
                                                <Button
                                                    type="text"
                                                    icon={<SettingOutlined />}
                                                />
                                                <span>Quản lý nhóm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                        <div className="chat-room-info-body-body">
                            <div
                                className="room-members"
                                onClick={() => setForm(true)}
                            >
                                <span
                                    className="chat-room-info-body-mn"
                                    style={{ paddingLeft: 10 }}
                                >
                                    Thành viên nhóm
                                </span>
                            </div>
                        </div>

                        <div className="chat-room-info-body-body">
                            <Menu mode="inline" items={imgItems} />
                        </div>
                        <div className="chat-room-info-footer">
                            <Menu
                                mode="inline"
                                items={settingItems}
                                defaultOpenKeys={["sub1"]}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="chat-room-info">
                    <div className="chat-room-info-header">
                        <Button
                            className="btn-back"
                            type="text"
                            onClick={() => setForm(false)}
                            icon={<LeftOutlined />}
                        />
                        <span>Thành viên</span>
                        <span style={{ width: 25 }}></span>
                    </div>
                    <div className="chat-room-info-body">
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "center",
                                paddingTop: 15,
                            }}
                        >
                            <div
                                className="btn-add"
                                onClick={() => setIsAddUserModalOpen(true)}
                            >
                                <UserAddOutlined />
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        paddingLeft: "2px",
                                    }}
                                >
                                    Thêm thành viên
                                </span>
                            </div>
                        </div>
                        <div style={{ paddingLeft: 23, paddingTop: 20 }}>
                            <span style={{ fontWeight: "bold" }}>
                                Danh sách thành viên ({roomChat.members.length})
                            </span>
                        </div>
                        <div style={{ paddingTop: 10 }}>
                            {roomChat !== undefined ? (
                                <div>
                                    {dsTV.map((mem, index) => {
                                        return (
                                            <div
                                                className="info-1"
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    paddingLeft: 23,
                                                    height: 50,
                                                    cursor: "pointer",
                                                    paddingRight: 20,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {mem.avatarImage ? (
                                                        <Avatar
                                                            size={40}
                                                            src={
                                                                mem.avatarImage
                                                            }
                                                        />
                                                    ) : (
                                                        <Avatar size={40}>
                                                            {mem.username
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}
                                                        </Avatar>
                                                    )}
                                                    <span
                                                        style={{ width: 10 }}
                                                    ></span>
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                        }}
                                                    >
                                                        {mem.username}
                                                    </span>
                                                    <span
                                                        style={{ width: 10 }}
                                                    ></span>
                                                    {mem._id ===
                                                    roomChat.manager ? (
                                                        <div>
                                                            <span>
                                                                (Nhóm trưởng){" "}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </div>
                                                <div
                                                    className="menuthanhvien"
                                                    onClick={() =>
                                                        onclickTV(mem)
                                                    }
                                                >
                                                    {user._id ===
                                                    roomChat.manager ? (
                                                        <div>
                                                            {mem._id !==
                                                            roomChat.manager ? (
                                                                <>
                                                                    <Dropdown
                                                                        trigger={[
                                                                            "click",
                                                                        ]}
                                                                        overlay={
                                                                            menu
                                                                        }
                                                                    >
                                                                        <span
                                                                            style={{}}
                                                                        >
                                                                            {" "}
                                                                            <BarsOutlined />
                                                                        </span>
                                                                    </Dropdown>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
