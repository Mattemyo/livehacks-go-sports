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
  state.users.push({ id: msg.userId, teamId: msg.teamId });
  return { type: 'team_select', teamId: msg.teamId };
};

const calcScore = (teamId, volume) => state.teams[teamId].score + volume;

const getAvgIntensity = (teamId) =>
  state.teams[teamId].intensity.length === 0
    ? 0
    : state.teams[teamId].intensity.reduce((acc, volume) => acc + volume, 0) /
      state.teams[teamId].intensity.length;

const handleScream = (msg, query) => {
  if (state.progress === 'finished') return {};

  const { teamId } = state.users.find((u) => u.id === query.userId) || {};

  if (teamId) {
    state.teams[teamId].intensity.push(msg.volume);
    state.teams[teamId].score += msg.volume;
    if (state.teams[teamId].intensity.length > 100) {
      state.teams[teamId].intensity.shift();
    }
  } else {
    console.log(`Missing TeamID. msg=${JSON.stringify(msg)}`);
  }

  return {
    type: 'scream',
    teams: {
      liverpool: {
        score: state.teams.liverpool.score,
        intensity: getAvgIntensity('liverpool'),
      },
      manchesteru: {
        score: state.teams.manchesteru.score,
        intensity: getAvgIntensity('manchesteru'),
      },
    },
  };
};

module.exports = {
  adminToUser: (msg) => {
    switch (msg.type) {
      case 'countdown':
        return { type: 'countdown', countdown: msg.countdown, stage: msg.stage };

      case 'start':
        state.progress = 'started';
        return { type: 'start' };

      case 'finish':
        state.progress = 'finished';
        return { type: 'finish' };

      default:
        console.log(`msg.type not found from Admin. Message: ${JSON.stringify(msg)}`);
        return {};
    }
  },
  userToAdmin: (msg, query) => {
    switch (msg.type) {
      case 'team_select':
        return registerUser(msg);

      case 'scream':
        return handleScream(msg, query);

      default:
        console.log(`msg.type not found from User. Message: ${JSON.stringify(msg)}`);
        return {};
    }
  },
};
