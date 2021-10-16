import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import useCookie from './util/useCookie';
import Login from './components/login';
import Logout from './components/logout';
import Chats from './components/chats';
import UsersInfo from './data/usersInfo';
import {apiUrl} from './util/request';

const SESSION_TOKEN_KEY = "session-token";

function AppManager() {
    const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
    const [roomId, setRoomId] = useState('');
    const usersInfo = useRef(new UsersInfo());

    function apiRequest(url, info) {
        const headersWithToken = "headers" in info ? info.headers : {};
        headersWithToken[SESSION_TOKEN_KEY] = sessionToken;
        info.headers = headersWithToken;

        return fetch(url, info).then(res => {
            if (res.ok) {
                return res;
            } else {
                if (res.status === 401) removeSessionToken();
                return Promise.reject(res);
            }
        });
    }

    async function setupSessionUser() {
        if (sessionToken === null) return;

        const roomJson = await (apiRequest(apiUrl("chatroom", "join"), {method: "POST"})
            .then(
                response => response.json(),
                error => console.error(error)));
        if (!roomJson) return;

        const userJson = await (apiRequest(apiUrl("user"), {
            method: "GET",
            headers: {"Accept": "application/json"}
        })
            .then(
                response => response.json(),
                error => console.error(error)));
        if (!userJson) return;

        usersInfo.current.setSessionUser(userJson);
        setRoomId(roomJson);
    }

    useEffect(() => setupSessionUser(), [sessionToken]);

    return (sessionToken === null || roomId.length === 0
        ? <Login setSessionToken={setSessionToken}></Login>
        : 
        <div>
            <Chats 
                apiRequest={apiRequest}
                roomId={roomId} 
                usersInfo={usersInfo}
                sessionToken={sessionToken}
            ></Chats>
            <Logout 
                removeSessionToken={removeSessionToken}
                setRoomId={setRoomId}
            ></Logout>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <AppManager></AppManager>
        </div>
    );
}

export default App;
