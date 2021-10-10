import { useEffect, useState } from 'react';
import { useRef } from 'react/cjs/react.development';
import { apiUrl, withParams } from '../util/request';
import useInterval from '../util/useInterval';

const RECENT_CHATS_COUNT = 100;
const CHAT_REFRESH_TIME = 10000; // 10 seconds
const WEBSOCKET_URL = "ws://localhost:8080/api/jam";

function Chats(props) {
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    let ws = useRef(null);

    useInterval(
        update, 
        CHAT_REFRESH_TIME
    );
    useEffect(setup, []);

    const makeWebsocket = () => {
        let ws = new WebSocket(WEBSOCKET_URL);
        ws.onopen = () => {
            ws.send(props.sessionToken);
        }
        ws.onmessage = (message) => {
            if (message.data === props.roomId) {
                getChats(props.roomId);
            }
        }
        ws.onerror = (error) => console.error(error);
    
        return ws;
    }
    
    function setup() {
        ws.current = makeWebsocket();
        getChats(props.roomId);
    }

    function update() {
        if (ws.current === null || ws.current.readyState === WebSocket.CLOSED) {
            ws.current = makeWebsocket();
        }
        getChats(props.roomId);
    }

    async function getChats() {
        if (props.roomId.length === 0) return;

        const chatsUrl = chats.length > 0
            ? withParams(apiUrl("chatroom", props.roomId, "after"), {"time": chats[chats.length-1].at})
            : withParams(apiUrl("chatroom", props.roomId, "recent"), {"count": RECENT_CHATS_COUNT});

        const newChats = await (props.apiRequest(chatsUrl, {
            method: "GET",
            headers: {"Accept": "application/json"}
        })
            .then(
                response => response.json(),
                error => console.error(error)));

        if (!newChats) return;

        await Promise.all(newChats
            .map(chat => chat.senderId)
            .filter(id => !props.usersInfo.current.hasUser(id))
            .map(fetchUserInfo));
        
        const res = chats.concat(newChats.reverse());
        setChats(res);
        setIsLoaded(true);
    }

    async function fetchUserInfo(userId) {
        const userJson = await (props.apiRequest(apiUrl("user", userId), {
            method: "GET",
            headers: {"Accept": "application/json"}
        })
            .then(
                response => response.json(),
                error => console.log(error)));
               
        props.usersInfo.current.setUser(userJson);
    }

    async function sendMessage(message) {
        if (message.length === 0) return;
        
        const sendResponse = await props.apiRequest(apiUrl("chatroom", props.roomId), {
            method: "POST",
            headers: {"Content-Type": "text/plain"},
            body: message
        });

        if (!sendResponse.ok) return;
        setMessage('');
        getChats(props.roomId);
    }

    function getUsername(userId) {
        const userInfo = props.usersInfo.current.getUser(userId);
        return userInfo != null ? userInfo.profile.username : "Unknown";
    }

    return (isLoaded 
        ?
        <div>
            <div id="chat">
                <ul>
                    {chats.map(chat => 
                        <li key={chat.id}>
                            <div 
                                className={props.usersInfo.current.isSessionUser(chat.senderId) ? "sent" : "received"}
                                key={chat.id}
                            >
                                <div className="username">{getUsername(chat.senderId)}</div>
                                <div>{chat.message}</div>
                            </div> 
                        </li>
                    )}
                </ul>
            </div>
            <div id="interface">
                <input type="text" id="message" name="Message" value={message} 
                    onInput={e => setMessage(e.target.value)}
                    onKeyPress={e => {if (e.key === "Enter") sendMessage(message)}}/><br/>
                <button onClick={() => sendMessage(message)}>Send</button>
            </div>
        </div>
        : 
        <ul></ul>
    );
}

export default Chats;