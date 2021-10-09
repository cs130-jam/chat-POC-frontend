import './App.css';
import React from 'react';

class Chats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            chats: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({username: "user1"})
        })
        .then(response => response.json())
        .then(
            result => console.log(result),
            error => console.error(error));
        // .then(
        //     result => this.setState({isLoaded: true, chats: result}),
        //     error => this.setState({isLoaded: true, error: error}));
    }

    render() {
        const { error, isLoaded, chats } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (<ul>{chats.map(chat => <li key={chat}><div class="sent">{chat}</div></li>)}</ul>);
        }
      }
}

function App() {
    return (
        <div className="App">
            <Chats></Chats>
        </div>
    );
}

export default App;
