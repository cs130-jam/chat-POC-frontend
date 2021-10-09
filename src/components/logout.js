import { apiUrl } from "../util/request";

function Logout(props) {
    async function logout() {
        const response = await (props.apiRequest(apiUrl("user", "logout"), {
            method: "GET",
            headers: {"Accept": "application/json"}
        })
            .then(
                response => response.json(),
                error => console.log(error)));

        if (!response) return;
        props.removeSessionToken();
    };

    return (
        <div>
            <button onClick={logout}>Log Out</button>
        </div>
    );
}

export default Logout;