import React, { useCallback, useMemo, useState } from 'react';
import Peer from 'peerjs';

import './App.css';

function outcome(mine, theirs) {
  if (mine === theirs) {
    return 'It is a tie! 👔';
  }

  if (
    (mine === 'rock' && theirs === 'paper')
    || (mine === 'paper' && theirs === 'scissors')
    || (mine === 'scissors' && theirs === 'rock')
  ) {
    return 'You lost... 😢';
  }

  return 'YOU WON 🎉';
}

function useCommunication() {
  const [connectId, setConnectionId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectedTo, setConnectedTo] = useState(null);
  const [myChoice, setMyChoice] = useState(null);
  const [theirChoice, setTheirChoice] = useState(null);

  const connection = useMemo(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      console.log('Connecting as', id);
      setConnectionId(id);
    });

    peer.on('connection', (conn) => {
      setConnectedTo(conn);

      conn.on('data', (data) => setTheirChoice(data));

      console.log('Incoming connection with', conn);
    });

    return peer;
  }, []);

  const connectTo = useCallback((id) => {
    setConnecting(true);
    const conn = connection.connect(id);

    conn.on('open', () => {
      setConnecting(false);
      setConnectedTo(conn);

      console.log('Connected with', conn);

      // Receive messages
      conn.on('data', (data) => setTheirChoice(data));
    });

    conn.on('error', (err) => console.error(err));
  }, [connection]);

  const pickChoice = useCallback((e) => {
    const value = e.target.value;
    setMyChoice(value);

    connectedTo.send(value);
  }, [connectedTo]);

  return [connectId, connecting, connectedTo, connectTo, myChoice, theirChoice, pickChoice];
}

function App() {
  const [
    connectId,
    connecting,
    connectedTo,
    connectTo,
    myChoice,
    theirChoice,
    pickChoice,
  ] = useCommunication();
  const [connectToId, setConnectToId] = useState('');

  const connectToExternal = useCallback((e) => {
    e.preventDefault();
    connectTo(connectToId);
  }, [connectTo, connectToId]);

  console.log(connectedTo);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Communication id: {connectId}
        </p>
        {!connectedTo && (
          <form onSubmit={connectToExternal}>
            <h3>Connect to:</h3>
            <input
              type="text"
              value={connectToId}
              onChange={(e) => setConnectToId(e.target.value)}
              disabled={connecting}
            />
            <button disabled={connecting} type="submit">Connect now</button>
          </form>
        )}
        {connectedTo && (
          <div>
            <h3>Playing against: {connectedTo.peer}</h3>

            {myChoice ? (
              <>
                <h2>You picked: {myChoice}</h2>
                {!theirChoice && <p>Waiting for other person</p>}
                {theirChoice && (
                  <>
                    <h2>They picked: {theirChoice}</h2>
                    <h1>{outcome(myChoice, theirChoice)}</h1>
                  </>
                )}
              </>
            ) : (
              <>
                <h2>WHAT IS YOUR CHOICE?</h2>
                <div className="options">
                  <button type="button" value="rock" onClick={pickChoice}>✊</button>
                  <button type="button" value="paper" onClick={pickChoice}>✋</button>
                  <button type="button" value="scissors" onClick={pickChoice}>✌️</button>
                </div>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
