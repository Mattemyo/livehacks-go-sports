const { userToAdmin, adminToUser } = require('./logic');

let userSocket, adminSocket;

const displayHandler = (req) => {
  adminSocket.on('message', (msg) => {
    try {
      userSocket.send(JSON.stringify(adminToUser(JSON.parse(msg))));
    } catch (error) {
      console.error(error);
    }

    console.log('Admin to User');
    console.log(msg);
  });
};

const userHandler = (req) => {
  userSocket.on('message', (msg) => {
    try {
      const parsedMsg = JSON.parse(msg);
      const dataToSend = JSON.stringify(userToAdmin(parsedMsg, req.query));
      adminSocket.send(dataToSend);
      if (parsedMsg.type === 'scream') {
        userSocket.send(dataToSend);
      }
    } catch (error) {
      console.error(error);
    }

    console.log('User to Admin:');
    console.log(msg);
  });
};

module.exports = (ws, req) => {
  if (req.query.isAdmin === 'true') {
    adminSocket = ws;
    displayHandler(req);
  } else {
    userSocket = ws;
    userHandler(req);
  }
};
