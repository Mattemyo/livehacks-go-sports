// TODO: FIX CONFIG PARAMETERS!!


const state = {
  progress: '',
  users: [],
  teams: {
    liverpool: {
      score: 0,
      intensity: 0,
    },
    manchesteru: {
      score: 0,
      intensity: 0,
    },
  },
};

const registerUser = (msg) => {
  users.push({ id: msg.id, team: message.team, scream: 0, isActive: true });
};

const handleScream = (msg) => {
  return {
    teams: {
      liverpool: {
        score: 0,
        intensity: 0,
      },
      manchesteru: {
        score: 0,
        intensity: 0,
      },
    },
  };
};

module.exports = {
  adminToUser: (msg) => {
    switch (msg.type) {
      case 'start':
        state.progress = 'started';
        return { type: 'start' };

      case 'finish':
        state.progress = 'finished';
        return { type: 'finish' };

      default:
        console.log('msg.type not found from Admin');
        return {};
    }
  },
  userToAdmin: (msg, query) => {
    switch (msg.type) {
      case 'team_select':
        return registerUser(msg);
      case 'scream':
        return handleScream(msg);
      default:
        console.log('msg.type not found from Admin');
        return {}
    }
    return { ...msg };
  },
};
