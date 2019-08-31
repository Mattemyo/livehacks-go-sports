const state = {
  progress: '',
  users: [],
  teams: {
    liverpool: {
      score: 0,
      intensity: [],
    },
    manchesteru: {
      score: 0,
      intensity: [],
    },
  },
};

const registerUser = (msg) => {
  users.push({ id: msg.userId, teamId: msg.teamId });
  return { type: 'team_select', teamId: msg.teamId };
};

const calcScore = (teamId, volume) => state.teams[teamId].score + volume;

const getAvgIntensity = (teamId) =>
  state.teams[teamId].intensity.reduce((acc, volume) => acc + volume) /
  state.teams[teamId].intensity.length;

const handleScream = (msg) => {
  if (state.progress === 'finished') return {};

  const { teamId } = users.find((u) => u.id === userId);

  state.teams[teamId].intensity.push(msg.volume);
  if (state.teams[teamId].intensity.length > 100) {
    state.teams[teamId].intensity.shift();
  }

  return {
    type: 'live_score',
    teams: {
      liverpool: {
        score: calcScore('liverpool', teamId === 'liverpool' ? volume : 0),
        intensity: getAvgIntensity('liverpool'),
      },
      manchesteru: {
        score: calcScore('manchesteru', teamId === 'manchesteru' ? volume : 0),
        intensity: getAvgIntensity('manchesteru'),
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
        return {};
    }
  },
};
