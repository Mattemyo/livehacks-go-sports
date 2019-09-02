const createSocket = (url) => {
  let socket = null;
  let connected = false;
  let connecting = false;
  let socketChecker;
  let msgReceiver = null;

  const connect = () => {
    ensureConnected();
    socketChecker = setInterval(ensureConnected, 1000);
  };

  const disconnect = () => {
    clearInterval(socketChecker);
    if (socket) {
      socket.close();
    }
  };

  const send = (msg) => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      disconnect();
    }
  };

  const receive = (msg) => {
    try {
      if (msgReceiver) {
        msgReceiver(JSON.parse(msg.data));
      } else {
        console.log('No msgReceiver');
      }
    } catch (err) {
      console.log('Got unparsable msg', msg.data);
      console.log(err);
    }
  };

  const ensureConnected = () => {
    if (!connected && !connecting) {
      console.log(`Attempting to connect to socket at ${url}`);
      connecting = true;
      socket = new WebSocket(url);

      socket.onmessage = receive;

      socket.onopen = () => {
        console.log('Connected to socket');
        connecting = false;
        connected = true;
      };

      socket.onclose = () => {
        socket = null;
        if (connected) {
          console.log('Lost socket to socket');
          connected = false;
        }
        connecting = false;
      };
    }
  };

  const getIsConnected = () => connected;

  const setMsgReceiver = (receiver) => {
    msgReceiver = receiver;
  };

  connect();
  window.onbeforeunload = disconnect;

  return { disconnect, send, setMsgReceiver, getIsConnected };
};

export default createSocket;
