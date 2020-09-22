import tmi from 'tmi.js';
import {
  BOT_USERNAME,
  OAUTH_TOKEN,
  CHANNEL_NAME,
  BLOCKED_WORDS,
  DEATH_ARRAY,
  MODS,
} from './constants';

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: [CHANNEL_NAME],
};

let Queue = [];
let Revolver = [];

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
  if (self) return;
  //console.log(userstate);

  // Hello Message
  if (message.toLowerCase() === '!whittlebot') {
    //let mod = false;
    //mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
    //if (mod) {
    client.say(channel, `/me I hate you.`);
    //}
  }

  //------------------------------------------------------------------------------------------

  // Literal Spam
  if (message.toLowerCase() === '!dance') {
    client.say(
      channel,
      `blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby pepePls Dance blobDance pepeJAMMER PartyKirby`
    );
  }

  //------------------------------------------------------------------------------------------

  // Just for Rhys
  if (message.toLowerCase() === '!crooked') {
    client.say(channel, "/me It's fine, it's only a little crooked.");
  }

  //------------------------------------------------------------------------------------------

  // Death Clips
  if (message.toLowerCase().startsWith('!death')) {
    let input = message.split(' ')[1];
    if (message.split(' ').length < 2) {
      return;
    }
    if (input > 0 && input < DEATH_ARRAY.length + 1) {
      client.say(channel, `/me @${userstate.username}, ${DEATH_ARRAY[input - 1]}`);
    }
  }

  //------------------------------------------------------------------------------------------

  // Queue system

  if (message.toLowerCase().startsWith('!queue')) {
    let input = message.split(' ')[1];
    if (message.split(' ').length < 2) {
      client.say(
        channel,
        `/me @${userstate.username}, valid arguments are "join", "leave", "next", "full".`
      );
      return;
    }

    let mod = false;

    switch (input.toLowerCase()) {
      case 'join':
        if (!userstate.subscriber) {
          break;
        }
        Queue.push(userstate.username);
        client.say(channel, `/me @${userstate.username} added to queue.`);
        break;
      case 'next':
        let next = Queue[0] ? Queue[0] : 'None';
        client.say(channel, `/me The next user in queue is: ${next}`);
        break;
      case 'full':
        client.say(channel, `/me The users currently in queue are: ${Queue}`);
        break;
      case 'leave':
        let index = Queue.indexOf(userstate.username);
        if (index > -1) {
          Queue.splice(index, 1);
          client.say(
            channel,
            `/me @${userstate.username}, you have been removed from the queue.`
          );
        }
        break;
      case 'rotate':
        mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
        if (mod) {
          client.say(channel, `@${Queue[0]}, you are up!`);
          Queue.shift();
        }
        break;
      case 'clear':
        mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
        if (mod) {
          client.say(channel, `/me The queue has been cleared.`);
          Queue = [];
        }
        break;
      default:
        client.say(
          channel,
          `/me @${userstate.username}, valid arguments are "join", "leave", "next", "full".`
        );
        break;
    }
  }

  //------------------------------------------------------------------------------------------

  // Russian Roulette

  if (message.toLowerCase().startsWith('!russian')) {
    let input = message.split(' ')[1];

    if (Revolver.length === 0 || (input && input.toLowerCase() === 'spin')) {
      Revolver = [0, 0, 0, 0, 0, 0];
      Revolver[Math.floor(Math.random() * 6)] = 1;
      client.say(
        channel,
        `/me @${userstate.username}, the revolver has been loaded and spun.`
      );
      return;
    }

    if (message.split(' ').length < 2) {
      if (Revolver[0] === 1) {
        Revolver.shift();
        client.say(channel, `/me @${userstate.username}, BANG!`);
        client.timeout(channel, userstate.username, 600);
        console.log(Revolver);
        // reload the gun after loss
        Revolver = [0, 0, 0, 0, 0, 0];
        Revolver[Math.floor(Math.random() * 6)] = 1;
        client.say(
          channel,
          `/me @${userstate.username}, the revolver has been loaded and spun.`
        );
        return;
      }
      if (Revolver[0] === 0) {
        Revolver.shift();
        client.say(
          channel,
          `/me @${userstate.username}, you have survived Russian Roulette.`
        );
        console.log(Revolver);
        return;
      }
    }
  }

  /*
  // Queue System information
  if (message.toLowerCase() === '!queue') {
    client.say(
      channel,
      `@${userstate.username}, the available options are !joinqueue, 
      !fullqueue (lists entire queue), !nextqueue (lists next person in queue), and 
      !leavequeue (takes you out of queue).`
    );
  }

  // Joining
  if (message.toLowerCase() === '!joinqueue') {
    Queue.push(userstate.username);
    client.say(channel, `/me @${userstate.username} added to queue.`);
  }

  // Display Full Queue
  if (message.toLowerCase() === '!fullqueue' && Queue[0]) {
    client.say(channel, `/me The users currently in queue are: ${Queue}`);
  }

  // Display Next Viewerr in Queue
  if (message.toLowerCase() === '!nextqueue') {
    let next = Queue[0] ? Queue[0] : 'None';
    client.say(channel, `/me The next user in queue is: ${next}`);
  }

  // Let user leave queue
  if (message.toLowerCase() === '!leavequeue' && Queue[0]) {
    let index = Queue.indexOf(userstate.username);
    if (index > -1) {
      Queue.splice(index, 1);
      client.say(
        channel,
        `/me @${userstate.username}, you have been removed from the queue.`
      );
    }
  }

  // MOD ONLY; Pull next person in queue
  if (message.toLowerCase() === '!dequeue') {
    let mod = false;
    mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
    if (mod) {
      client.say(channel, `@${Queue[0]}, you are up!`);
      Queue.shift();
    }
  }
  */

  //------------------------------------------------------------------------------------------

  /*
  // List Ban
  if (message.toLowerCase().startsWith('!listban')) {
    let mod = false;
    mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
    if (mod) {
      client.deletemessage(channel, userstate.id);
      let input = message.split(' ');
      console.log(input);
      if (message.split(' ').length < 2) {
        return;
      }
      {
        for (let idiot = 1; idiot < message.split(' ').length; idiot++) {
          client.ban(channel, ${input[idiot]}, 'WhittleBot listban performed by '${userstate.username});
        }
      }
    }
  }*/

  //------------------------------------------------------------------------------------------

  // List Timeout
  /*if (message.toLowerCase().startsWith('!timeout ')) {
    let mod = false;
    mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
    if (mod) {
      client.deletemessage(channel, userstate.id);
      let input = message.split(' ');
      console.log(input);
      if (message.split(' ').length < 2) {
        return;
      }
      {
        for (let idiot = 1; idiot < message.split(' ').length; idiot++) {
          client.say(channel, `/timeout ${input[idiot]} 86400 'WhittleBot big timeout'`);
        }
      }
    }
  } */
  if (userstate.username === BOT_USERNAME) return;

  //checkTwitchChat(userstate, message, channel);

  /*
// BAD WORD CHECKER
function checkTwitchChat(userstate, message, channel) {
  let shouldSendMessage = false;
  // Check message
  shouldSendMessage = BLOCKED_WORDS.some((blockedWord) =>
    message.toLowerCase().includes(blockedWord.toLowerCase())
  );

  if (shouldSendMessage) {
    // Tell user to fuck off
    client.say(channel, `/me @${userstate.username}, sorry! Your message was deleted.`);

    //delete message
    client.deletemessage(channel, userstate.id);
  }
}*/
});
