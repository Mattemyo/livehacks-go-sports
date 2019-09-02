const { userToAdmin, adminToUser } = require('./logic');

let usersockets = [];
let adminsocket = null;

const adminHandler = (req) => {
  adminsocket.on('message', (msg) => {
    try {
      usersockets.forEach(
        (socket) =>
          socket.readyState === socket.OPEN &&
          socket.send(JSON.stringify(adminToUser(JSON.parse(msg))))
      );
    } catch (error) {
      console.error(error);
    }

    // console.log('Admin to User');
    // console.log(msg);
  });
};

let screamCounter = 0;

const userHandler = (req) => {
  usersockets.forEach((socket) => {
    socket.on('message', (msg) => {
      try {
        const parsedMsg = JSON.parse(msg);
        const payload = JSON.stringify(userToAdmin(parsedMsg, req.query));
        if (adminsocket.readyState === adminsocket.OPEN) adminsocket.send(payload);

        if (parsedMsg.type === 'scream' && screamCounter % 5 === 0) {
          usersockets.forEach(
            (usersocket) => usersocket.readyState === usersocket.OPEN && usersocket.send(payload)
          );
        }

        screamCounter++;
      } catch (error) {
        console.error(error);
      }

      // console.log('User to Admin:');
      // console.log(msg);
    });
  });
};

module.exports = (ws, req) => {
  if (req.query.isAdmin === 'true') {
    adminsocket = ws;
    adminHandler(req);
  } else {
    usersockets.push(ws);
    userHandler(req);
  }
};
