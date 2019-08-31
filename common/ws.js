const createSocket = (url) => {
  let connection = null;
  let connected = false;
  let connecting = false;
  let connectionChecker;

  const connect = () => {
    ensureConnected();
    connectionChecker = setInterval(ensureConnected, 1000);
  };

  const disconnect = () => {
    clearInterval(connectionChecker);
    if (connection) {
      connection.close();
    }
  };

  const send = (msg) => {
    console.log(`Sending data: ${JSON.stringify(msg)}`);
    connection.send(JSON.stringify(msg));
  };

  const receive = (msg) => {
    try {
      if (msgReceiver) {
        msgReceiver(JSON.parse(msg.data));
      } else {
        console.log('No msgReceiver');
      }
    } catch (err) {
      return console.log('Got unparsable msg', msg.data);
    }
  };

  const ensureConnected = () => {
    if (!connected && !connecting) {
      console.log(`Attempting to connect to socket at ${url}`);
      connecting = true;
      connection = new WebSocket(url);
      connection.onopen = () => {
        console.log('Connected to socket');
        connecting = false;
        connected = true;
      };
      connection.onclose = () => {
        connection = null;
        if (connected) {
          console.log('Lost connection to socket');
          connected = false;
        }
        connecting = false;
      };
    }
  };

  const getIsConnected = () => connected;

  const setMsgReceiver = (handler) => {
    msgReceiver = handler;
  };

  connect();

  return { disconnect, send, setMsgReceiver, getIsConnected };
};

export default createSocket;
