import { Avatar } from "antd";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { AppContext } from "../../context/AppProvider";
import "./style.css";
import { getUserByPhoneNumberOrUserName } from "../../utils/APIRoutes";
import axios from "axios";

export default function SearchList({ contacts, changeChat }) {
    const {
        setRoomChat,
        roomChat,
        rooms,
        setShowInfoRoom,
        setSearchInListFriend,
        searchInListFriend,
        listSearchInFriend,
        setListSearchInFriend,
    } = useContext(AppContext);

    useEffect(() => {
        setShowInfoRoom(false);
    }, [roomChat]);

    const [statusSearch, setStatusSearch] = useState([]);

    const click = (contact) => {
        changeChat(contact);
    };

    useEffect(() => {
        async function fetchData() {
            const response = await axios.post(getUserByPhoneNumberOrUserName, {
                search: searchInListFriend,
            });
            console.log(response.data.data);
            if (
                response.data.data === "" ||
                response.data.data === null ||
                response.data.data.length === 0
            ) {
                setListSearchInFriend([]);
                setStatusSearch("Không tìm thấy kết quả phù hợp");
            } else if (searchInListFriend.length === 0) {
                setStatusSearch("Tìm kiếm gần đây");
            } else {
                setListSearchInFriend(response.data.data);
                setStatusSearch("Tìm kiếm bạn");
            }
            roomChat([]);
        }
        fetchData();
    }, [searchInListFriend]);

    return (
        <div className="search-list">
            <span
                style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingLeft: "0.8rem",
                }}
            >
                {statusSearch}
            </span>

            {/* Data tets */}
            {listSearchInFriend.length === 0
                ? ""
                : listSearchInFriend.map((contact, index) => {
                      return (
                          <div
                              className="contact"
                              onClick={() => click(contact)}
                          >
                              <div className="avt">
                                  {contact.avatarImage ? (
                                      <Avatar
                                          size={60}
                                          src={contact.avatarImage}
                                      ></Avatar>
                                  ) : (
                                      <Avatar size={60}>
                                          <span style={{ fontSize: "34px" }}>
                                              {contact.username
                                                  ?.charAt(0)
                                                  ?.toUpperCase()}
                                          </span>
                                      </Avatar>
                                  )}
                              </div>
                              <div className="name">
                                  <h3>{contact.username}</h3>
                              </div>
                          </div>
                      );
                  })}

            {/* {rooms.map((room, index) => {
                return (
                    <div className="contact" onClick={() => setRoomChat(room)}>
                        <div className="avt">
                            <Avatar size={60} src={room.avatarImage}>
                                {room.avatarImage
                                    ? ""
                                    : room.roomName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                        </div>
                        <div className="name">
                            <h3>{room.roomName}</h3>
                        </div>
                    </div>
                );
            })} */}
        </div>
    );
}
