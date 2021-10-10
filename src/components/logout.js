function Logout(props) {
    function logout() {
        props.removeSessionToken();
        props.setRoomId('');
    }
    
    return (
        <div>
            <button onClick={logout}>Log Out</button>
        </div>
    );
}

export default Logout;