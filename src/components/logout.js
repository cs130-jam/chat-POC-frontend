import { apiUrl } from "../util/request";

function Logout(props) {
    return (
        <div>
            <button onClick={props.removeSessionToken}>Log Out</button>
        </div>
    );
}

export default Logout;