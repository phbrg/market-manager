const Log = require('../models/Log');

const createLog = async (category, message, UserId) => {
  if(!category || !message) {
    throw new Error('Invalid data.');
  }

  if(category !== 'CREATE' && category !== 'UPDATE' && category !== 'DELETE' && category !== 'ACESS') {
    throw new Error('Invalid category.');
  }

  const log = {
    message,
    category,
    UserId: null
  }

  if(UserId) {
    log.UserId = UserId;
  }

  await Log.create(log)
    .then((log) => {
      return `Log successfully created\n${log}`;
    }).catch((err) => {
      console.log(`> create log error: ${err}`);
      throw new Error("Couldn't crete log, try again later.");
    })
};

module.exports = createLog;