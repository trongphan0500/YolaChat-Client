import React from "react";
import {
    UserAddOutlined,
    UsergroupAddOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import "./style.css";
import { AppContext } from "../../context/AppProvider";

export default function Search() {
    const {
        setIsAddFriendModalOpen,
        setIsAddGroupModalOpen,
        isSearchInput,
        setIsSearchInput,
        searchInListFriend,
        setSearchInListFriend,
    } = React.useContext(AppContext);

    const handleSearch = (e) => {
        setSearchInListFriend(e.target.value);
        setIsSearchInput(true);
    };

    const handleClose = () => {
        setIsSearchInput(false);
    };

    const handleAddUser = () => {
        setIsAddFriendModalOpen(true);
    };

    const handleAddGroup = () => {
        setIsAddGroupModalOpen(true);
    };

    return (
        <div className="search">
            <div
                className="search-form"
                style={{
                    border: isSearchInput ? "1px solid #40A9FF" : "",
                    backgroundColor: isSearchInput ? "white" : "",
                }}
            >
                <SearchOutlined style={{ color: "black", fontSize: "18px" }} />
                <Input
                    type="text"
                    placeholder={"Tìm kiếm"}
                    bordered={false}
                    autoComplete="off"
                    value={searchInListFriend}
                    onChange={(e) => {
                        handleSearch(e);
                    }}
                    onClick={handleSearch}
                />
            </div>
            {isSearchInput ? (
                <div className="search-btn">
                    <Button className="btn-close" onClick={handleClose}>
                        Đóng
                    </Button>
                </div>
            ) : (
                <div className="search-btn">
                    <Button
                        type="text"
                        icon={<UserAddOutlined />}
                        className="btn-add-user-group"
                        onClick={handleAddUser}
                    ></Button>
                    <Button
                        type="text"
                        icon={<UsergroupAddOutlined />}
                        className="btn-add-user-group"
                        onClick={handleAddGroup}
                    ></Button>
                </div>
            )}
        </div>
    );
}
