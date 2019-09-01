const { userToAdmin, adminToUser } = require('./logic');

let usersocket = null;
let adminsocket = null;

const displayHandler = (req) => {
  adminsocket.on('message', (msg) => {
    try {
      usersocket.send(JSON.stringify(adminToUser(JSON.parse(msg))));
    } catch (error) {
      console.error(error);
    }

    // console.log('Admin to User');
    // console.log(msg);
  });
};


let screamCounter = 0;

const userHandler = (req) => {
  usersocket.on('message', (msg) => {
    try {
      const parsedMsg = JSON.parse(msg);
      const payload = JSON.stringify(userToAdmin(parsedMsg, req.query));
      adminsocket.send(payload);
      if (parsedMsg.type === 'scream' && screamCounter % 5 === 0) {
        usersocket.send(payload);
      }
      screamCounter++;
    } catch (error) {
      console.error(error);
    }

    // console.log('User to Admin:');
    // console.log(msg);
  });
};

module.exports = (ws, req) => {
  if (req.query.isAdmin === 'true') {
    adminsocket = ws;
    displayHandler(req);
  } else {
    usersocket = ws;
    userHandler(req);
  }
};
