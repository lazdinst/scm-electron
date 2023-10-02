import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const { electron } = window;

type ConnectionState = {
  success: boolean;
  message: string;
};

function Matrix(): React.JSX.Element {
  const [socket, setSocket] = useState<any | null>(null);
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<string[]>([]);
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const [connectionResult, setConnectionResult] = useState<ConnectionState>({
    success: false,
    message: '',
  });
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('totalConnections', (count: number) => {
        setTotalUsers(count);
      });

      return () => {
        socket.off('totalConnections');
      };
    }
    return () => {};
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveJson', (data: any) => {
        setChat((prevChat) => [...prevChat, data.message]);
      });

      return () => {
        socket.off('receiveJson');
      };
    }
    return () => {};
  }, [socket]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() !== '' && socket) {
      socket.emit('sendJson', { message });
      setMessage('');
    }
  };

  const testDBConnection = () => {
    electron.ipcRenderer.sendMessage('test-db-connection');
  };

  useEffect(() => {
    electron.ipcRenderer.on('test-db-connection-result', (result: any) => {
      console.log('test-db-connection-result', result);
      setConnectionResult(result);
    });
  }, []);

  return (
    <div style={{ width: '300px' }}>
      <div
        style={{
          height: '200px',
          overflow: 'auto',
          border: '1px solid black',
          padding: '10px',
        }}
      >
        {chat.map((msg) => (
          <div key={uuidv4()}>{msg}</div>
        ))}

        <div ref={messageEndRef} />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        rows={4}
      />
      <button type="button" onClick={sendMessage}>
        Send Message
      </button>
      <div>
        <button type="button" onClick={testDBConnection}>
          Test DB Connection
        </button>
        <div>
          <p>Success: {String(connectionResult.success)}</p>
          <p>Message: {connectionResult.message}</p>
        </div>
        <p>Total Users Connected: {totalUsers}</p>
      </div>
    </div>
  );
}

export default Matrix;
