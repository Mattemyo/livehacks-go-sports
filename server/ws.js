const { userToAdmin, adminToUser } = require('./logic');

let userSocket, displaySocket;

const displayHandler = (req) => {
  displaySocket.on('message', (msg) => {
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
      displaySocket.send(JSON.stringify(userToAdmin(JSON.parse(msg), req.query)));
    } catch (error) {
      console.error(error);
    }

    console.log('User to Admin:');
    console.log(msg);
  });
};

module.exports = (ws, req) => {
  if (req.query.isAdmin === 'true') {
    displaySocket = ws;
    displayHandler(req);
  } else {
    userSocket = ws;
    userHandler(req);
  }
};
