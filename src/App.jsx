import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { socket } from './socket';
import './styles.css';

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('enviar-mensaje', (payload) => {
      setReceivedMessage(payload.message);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  function sendMessage() {
    
    const payload = {
        message,
        date: new Date()
    };
    
    socket.emit( 'enviar-mensaje', payload, ( id ) => {
        console.log('Desde el server', id );
    });

    setMessage('');
  }


  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <br />
        <h3>Vite + React Socket Chat</h3>
      </div>

        <div className="card">
          
          <p>{ `Connected: ${isConnected}` }</p>


          <button onClick={ connect }>Connect</button>
          <button onClick={ disconnect }>Disconnect</button>

      </div>

      <textarea 
        readOnly
        disabled
        value={ receivedMessage }
        name="receivedMessage" 
        id="received-id" 
        cols="40" 
        rows="5"
      />
        
      <div className="card">
        
          <input 
            type="text" 
            name="mensaje" 
            id="message-id" 
            placeholder='Message' 
            value={message || ''}
            onChange={(e) => {setMessage(e.target.value)}}
          />
          
          <button onClick={ sendMessage } >Send</button>

      </div>
    </>
  )
}

export default App
