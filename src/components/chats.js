import { useEffect, useState } from 'react';
import { apiUrl, withParams } from '../util/request';
import useInterval from '../util/useInterval';

const RECENT_CHATS_COUNT = 100;
const CHAT_REFRESH_TIME = 10000; // 10 seconds

function Chats(props) {
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useInterval(
        () => getChats(props.roomId), 
        CHAT_REFRESH_TIME
    );
    useEffect(() => getChats(props.roomId), []);

    async function getChats(roomId) {
        if (roomId.length === 0) return;

        const chatsUrl = chats.length > 0
            ? withParams(apiUrl("chatroom", roomId, "after"), {"time": chats[chats.length-1].at})
            : withParams(apiUrl("chatroom", roomId, "recent"), {"count": RECENT_CHATS_COUNT});

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
        
        setChats(chats.concat(newChats.reverse()));
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

    async function sendMessage(message, roomId) {
        if (message.length === 0) return;
        
        const sendResponse = await (props.apiRequest(apiUrl("chatroom", roomId), {
            method: "POST",
            body: message
        })
            .then(
                response => response.json(),
                error => console.log(error)));

        setMessage('');
        getChats(roomId);
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
                                <div className="username">{props.usersInfo.current.getUser(chat.senderId).profile.username}</div>
                                <div>{chat.message}</div>
                            </div> 
                        </li>
                    )}
                </ul>
            </div>
            <div id="interface">
                <input type="text" id="message" name="Message" value={message} 
                    onInput={e => setMessage(e.target.value)}
                    onKeyPress={e => {if (e.key === "Enter") sendMessage(message, props.roomId)}}/><br/>
                <button onClick={() => sendMessage(message, props.roomId)}>Send</button>
            </div>
        </div>
        : 
        <ul></ul>
    );
}

export default Chats;