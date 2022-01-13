const { error } = require('console');
const slackAPI = require('./slackAPI');

const slack = (req, message) => {
  const slackMessage = `🚨 Detected error on FILL-IN Server 🚨
  📡 Route - [${req.method.toUpperCase()}] ${req.originalUrl} 
  
  🚧 ${message}

  🔍 ${JSON.stringify(error)}`;

  slackAPI.sendMessageToSlack(slackMessage, slackAPI.DEV_WEB_HOOK_ERROR_MONITORING);
};

module.exports = { slack };
