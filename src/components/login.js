import { useState } from 'react';
import { apiUrl } from '../util/request';

function Login(props) {
    const [username, setUsername] = useState("");

    async function setSessionToken(username) {
        if (username.length === 0) return;

        const loginResponse = await fetch(apiUrl("login"), {
            method: "POST",
            headers: {"Content-Type": "application/json", "Accept": "application/json"},
            body: JSON.stringify({username: username})
        });

        if (!loginResponse.ok) {
            console.error("Failed to log in");
        } else {
            const loginJson = await loginResponse.json();
            props.setSessionToken(loginJson.token);
        }
    }

    return (
        <div>
            <input type="text" name="Username" 
                value={username} onInput={e => setUsername(e.target.value)}
                onKeyPress={e => {if (e.key === "Enter") setSessionToken(username)}}/>
            <br/>
            <button onClick={() => setSessionToken(username)}>Login</button>
        </div>
    );
}

export default Login;