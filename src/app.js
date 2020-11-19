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

let queueEnable = false;
let subOnly = true;
let Queue = [];
let Revolver = [];

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
  if (self) return;
  //console.log(userstate);

  // Hello Message
  if (message.toLowerCase() === '!whittlebot') {
    client.say(channel, `/me I hate you.`);
  }

  //------------------------------------------------------------------------------------------

  // Commands
  if (message.toLowerCase() === '!whittlebot commands') {
    client.whisper(
      userstate.username,
      `WhittleBot Commands: WhittleBot, Dance, Crooked, d<##>, CoinFlip, Oxillery, Tommi, Catssnap, Filthy, Aiden, Paisley, Simp, Death <#>, Queue <Join, Leave, Full, Next, Rotate*, Add*, Remove*, Clear*, Sub*, Toggle*>, Russian [spin*]. NOTE: Commands marked with * are mod only. Commands in <> are required. Commands in [] are optional.`
    );
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

  // Nerd Shit pt. 1 (Dice Rolling)
  if (message.toLowerCase().match(/!d\d+/g)) {
    let num = Math.floor(Math.random() * parseInt(message.substring(1).substring(1)) + 1);
    client.say(
      channel,
      `/me @${userstate.username} rolled a d${message
        .substring(1)
        .substring(1)} and got ${num}!`
    );
  }

  if (message.toLowerCase() === '!coinflip') {
    let num = Math.floor(Math.random() * 2 + 1);
    if (num === 1) {
      client.say(channel, `/me @${userstate.username} flipped a coin and got heads!`);
    }
    if (num === 2) {
      client.say(channel, `/me @${userstate.username} flipped a coin and got tails!`);
    }
  }

  //------------------------------------------------------------------------------------------

  // Child
  if (message.toLowerCase() === '!oxillery') {
    client.say(channel, '/me Pen15');
  }

  // Tommi
  if (message.toLowerCase() === '!tommi') {
    client.say(channel, '/me <Starting tommi.exe>');
  }

  // Catssnap
  if (message.toLowerCase() === '!catssnap') {
    if (userstate.username === 'catssnap') {
      client.say(channel, `/me I love you.`);
    } else {
      client.say(channel, '/me Poggie Woggies UwU');
    }
  }

  // Filthy
  if (message.toLowerCase() === '!filthy') {
    if (userstate.username === 'filthytator') {
      client.say(channel, `/me "Vehicular manslaughter has never been so tempting."`);
    } else {
      client.say(channel, '/me Fuckin pog dude POGGERS');
    }
  }

  if (message.toLowerCase() === '!aiden') {
    client.say(channel, '/me "How much is the fish?"');
  }

  // Paisley
  if (message.toLowerCase() === '!paisley') {
    if (userstate.username === 'paisachu') {
      client.say(channel, `/me Fuck off, Paisley.`);
    } else {
      client.say(channel, '/me  "I like to ween out the children."');
    }
  }

  // Simp
  if (message.toLowerCase() === '!simp') {
    client.say(channel, `peepoSimp peepoSimp peepoSimp peepoSimp peepoSimp`);
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
  //let mod = false;
  let mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));

  // Enable / Disable Queue. Off by default
  if (message.toLowerCase() === '!queue toggle' && mod) {
    queueEnable = !queueEnable;
    client.say(channel, `/me Queue Enabled: ${queueEnable}`);
  }

  // Enable / Disable sub only mode. Enabled by default.
  if (message.toLowerCase() === '!queue sub' && mod) {
    subOnly = !subOnly;
    client.say(channel, `/me Sub Queue Mode: ${subOnly}`);
  }

  // Argument handling
  if (message.toLowerCase().startsWith('!queue') && queueEnable) {
    let arg1 = message.split(' ')[1];
    let arg2 = message.split(' ')[2];

    // Return if invocation was a setting command
    if (
      message.toLowerCase() === '!queue toggle' ||
      message.toLowerCase() === '!queue sub'
    ) {
      return;
    }

    // Check for invalid/missing arguments
    if (message.split(' ').length < 2) {
      client.whisper(
        userstate.username,
        `@${userstate.username}, valid arguments are "join", "leave", "next", "full".`
      );
      return;
    }

    switch (arg1.toLowerCase()) {
      // User join
      case 'join':
        if (!userstate.subscriber && subOnly) {
          client.whisper(
            userstate.username,
            `@${userstate.username}, only subscribers may join the queue.`
          );
          break;
        }
        Queue.push(userstate.username);
        client.whisper(
          userstate.username,
          `You have been added to the queue. People ahead of you: ${Queue.length - 1}`
        );
        break;

      // List next user in queue
      case 'next':
        let next = Queue[0] ? Queue[0] : 'None';
        client.say(channel, `/me The next user in queue is: ${next}`);
        break;

      // List entire queue
      case 'full':
        if (Queue[0]) {
          client.say(channel, `/me The users currently in queue are: ${Queue}`);
        } else {
          client.say(channel, `/me The are no users currently in the queue.`);
        }
        break;

      // User leaving queue
      case 'leave':
        let index = Queue.indexOf(userstate.username);
        if (index > -1) {
          Queue.splice(index, 1);
          client.whisper(userstate.username, `You have been removed from the queue.`);
        }
        break;

      // MOD Ping next person in queue and remove from array
      case 'rotate':
        if (mod) {
          client.say(channel, `@${Queue.shift()}, you are up!`);
        }
        break;

      // MOD Clear entire queue
      case 'clear':
        if (mod) {
          Queue = [];
          client.whisper(userstate.username, `The queue has been cleared.`);
        }
        break;

      // MOD Remove user from queue
      case 'remove':
        if (mod && arg2) {
          let index = Queue.indexOf(arg2);
          if (index > -1) {
            Queue.splice(index, 1);
            client.whisper(
              userstate.username,
              `${arg2} has been removed from the queue.`
            );
          } else {
            client.whisper(userstate.username, `Invalid user name.`);
          }
        }
        break;

      // MOD Add user to queue
      case 'add':
        if (mod && arg2) {
          Queue.push(arg2);
          client.whisper(userstate.username, `${arg2} has been added to the queue.`);
        }
        break;

      default:
        client.whisper(
          userstate.username,
          `@${userstate.username}, valid arguments are "join", "leave", "next", "full".`
        );
        break;
    }

    console.log(Queue);
  }

  //------------------------------------------------------------------------------------------

  // Russian Roulette

  if (message.toLowerCase().startsWith('!russian')) {
    let input = message.split(' ')[1];

    let mod = false;
    mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));

    // Mod activated reset condition
    if (Revolver.length === 0 || (input && input.toLowerCase() === 'spin' && mod)) {
      Revolver = [0, 0, 0, 0, 0, 0];
      Revolver[Math.floor(Math.random() * 6)] = 1;
      console.log(Revolver);
      client.say(
        channel,
        `/me @${userstate.username}, the revolver has been loaded and spun.`
      );
      return;
    }

    // Standard function
    if (message.split(' ').length < 2) {
      // Kill condition
      if (Revolver[0] === 1) {
        Revolver.shift();
        client.say(channel, `/me @${userstate.username}, BANG!`);
        client.timeout(channel, userstate.username, 600, 'Russian Roulette');
        // Reset revolver after loss
        Revolver = [0, 0, 0, 0, 0, 0];
        Revolver[Math.floor(Math.random() * 6)] = 1;
        client.say(channel, `/me The revolver has been reloaded and spun.`);
        console.log(Revolver);
        return;
      }

      // Survival Condition
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

  //------------------------------------------------------------------------------------------
  /*
  // High Stakes Roulette

  if (message.toLowerCase().startsWith('!highstakes')) {
    let arg1 = message.toLowerCase().split(' ')[1];
    let arg2 = message.toLowerCase().split(' ')[2];

    if (arg1 == 'help') {
      client.say(
        channel,
        `/me @${userstate.username}, High Stakes Roulette is a game of bad odds and even worse reward. Win, you get nothing. Lose, you are timed out for a MINIMUM of 30 minutes. To play, type "!highstakes <arg1> <arg2>", where arg1 is the percentage chance to lose (between 50 and 99), and arg2 is the amount of time in seconds you will be timed out if you lose (minimum 1800). Good luck out there.`
      );
      return;
    }
    if (!arg2) {
      client.say(channel, `/me Invalid argument(s). Please use "!highstakes help".`);
      return;
    } else {
      // Enforce number arguments
      if (isNaN(arg1) || isNaN(arg2)) {
        client.say(channel, `/me Invalid argument(s). Please use "!highstakes help".`);
        return;
      }

      // Enforce odds (>50, <100)
      arg1 = arg1 < 50 ? 50 : arg1;
      arg1 = arg1 >= 100 ? 99 : arg1;

      // Enforce minimum timeout length
      arg2 = arg2 < 1800 ? 1800 : arg2;

      // Generate random number between 1-100
      let result = Math.floor(Math.random() * 100) + 1;

      // Compare result to odds to lose and proceed accordingly
      if (arg1 > result) {
        client.timeout(channel, userstate.username, arg2, 'High Stakes Roulette');
      } else {
        client.say(
          channel,
          `/me @${userstate.username}, you have survived High Stakes Roulette. Have a hug. itspaiLuv`
        );
      }
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
