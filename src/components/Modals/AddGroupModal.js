import React, { useContext, useState } from "react";
import { List, Modal, Typography, Input, Avatar } from "antd";
import { AppContext } from "../../context/AppProvider";
import AvatarUploader from "react-avatar-uploader";
import "./style.css";
import axios from "axios";
import { addRoom } from "../../utils/APIRoutes";
export default function AddGroupModal() {
    const {
        isAddGroupModalOpen,
        setIsAddGroupModalOpen,
        contacts,
        user,
        setRoom,
        rooms,
        setRooms,
        listCurrentFriend,
    } = useContext(AppContext);
    const data = contacts;
    const [members, setMembers] = useState([]);
    const [roomName, setRoomName] = useState();
    const [dscheck, setdsCheck] = useState([]);

    const handleUpdate = async () => {
        setIsAddGroupModalOpen(false);

        const mems = [...members];
        mems.push(user._id);
        console.log(mems);
        if (user) {
            try {
                const data = await axios.post(addRoom, {
                    roomName: roomName,
                    members: mems,
                    manager: user._id,
                });
                const rooom = {
                    roomName: roomName,
                    members: mems,
                    manager: user._id,
                    id: data.data.id,
                };

                const roooms = [...rooms];
                roooms.push(rooom);

                setRooms(roooms);
                setMembers([]);
                // console.log(data.data[0].members);
            } catch (error) {
                console.log(error);
            }
        }
        // }
        // setMembers(mems);
        // setRoom({members:mems,roomName:roomName})
        // for(let i =0;i<mems.length;i++)
        // {
        //   console.log(mems[i].user.username);
        // }
    };

    const handleCancel = () => {
        setIsAddGroupModalOpen(false);
        // console.log(members);
    };

    const addMembers = (user) => {
        const mems = [...members];
        // alert("click")
        if (mems.indexOf(user._id) < 0) {
            mems.push(user._id);

            setMembers(mems);
        }
    };

    return (
        <div>
            <Modal
                title="Tạo nhóm"
                open={isAddGroupModalOpen}
                onCancel={handleCancel}
                onOk={handleUpdate}
                cancelText="Hủy"
                okText="Tạo nhóm"
            >
                <form>
                    <div className="md-add-group-header">
                        <div className="md-add-group-header-name">
                            <div>
                                <AvatarUploader
                                    defaultImg="https://cdn-icons-png.flaticon.com/512/1177/1177568.png"
                                    size={50}
                                    uploadURL="http://localhost:3000"
                                    fileType={"image"}
                                />
                            </div>
                            <Input
                                onChange={(e) => setRoomName(e.target.value)}
                                className="md-add-group-header-name-input"
                                placeholder="Nhập tên nhóm ..."
                            />
                        </div>
                    </div>
                    <div className="md-add-group-body">
                        <br></br>
                        <span style={{ fontSize: "16px" }}>
                            Thêm bạn vào nhóm
                        </span>
                        <Input placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại" />
                        <br></br>
                        <br></br>
                        {/* <List
              className="md-add-user-list"
              size="large"
              bordered
              dataSource={data}
              renderItem={(item, addMembers) => (
                <List.Item  onClick={() => {console.log("click");}}>
                  <div >
                    {item.username}
                  </div>
                   
                </List.Item>
              )}
            /> */}
                        {listCurrentFriend.map((user, index) => {
                            return (
                                <div className="dsBan">
                                    <div
                                        className="click"
                                        onClick={() => addMembers(user)}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flex: 0.15,
                                            }}
                                        >
                                            <input type={"checkbox"}></input>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flex: 0.8,
                                            }}
                                        >
                                            <div style={{ paddingTop: 7 }}>
                                                <Avatar
                                                    src={user.avatarImage}
                                                ></Avatar>
                                            </div>
                                            <p></p>
                                            <p className="thep">
                                                {user.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </form>
            </Modal>
        </div>
    );
}
