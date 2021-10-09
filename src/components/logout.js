import { apiUrl } from "../util/request";

function Logout(props) {
    async function logout() {
        const response = await props.apiRequest(apiUrl("logout"), {method: "POST"});
        if (!response.ok) return;
        props.removeSessionToken();
    };

    return (
        <div>
            <button onClick={logout}>Log Out</button>
        </div>
    );
}

export default Logout;