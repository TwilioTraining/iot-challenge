const SyncClient = require('twilio-sync');
const fetch = require('node-fetch');

// your Flex account credentials
const accountSid = '';
const authToken = '';

// your Flex TaskRouter Workspace and Workflow
const workspace = '';
const workflow = '';

// SID of the newly created IoT TaskChannel
const iotTaskchannel = '';

// Twilio part - Sync token generator (do not change)
const tokenGeneratorUrl = 'https://arsenic-mayfly-4218.twil.io/sync_token_generator';

// Twilio part - Sync Message Stream unique name
// (Twilio part publishes events into this stream, do not change)
const syncStream = 'IoT_Alerts';

const client = require('twilio')(accountSid, authToken);

// helper function for fetching access tokens from Sync token generator
function fetchToken(updateToken) {
  fetch(tokenGeneratorUrl, {
    method: 'GET'
  }).then(res => {
    return res.text();
  }).then(token => {
    updateToken(token);
  });
}

let syncClient;
// fetch intial Sync token and use it to initialize SyncClient (JS SDK object)
fetchToken(initialToken => {
  syncClient = new SyncClient(initialToken);
  syncClient.on('tokenAboutToExpire', () => {
    // if Sync token is about to expire, renew it
    fetchToken(function (updatedToken) {
      syncClient.updateToken(updatedToken);
    });
  });
  syncClient.stream(syncStream)
    .then(function (stream) {
      console.log("Successfully subscribed to Sync Message Stream '" + stream.uniqueName + "'");
      stream.on('messagePublished', event => {
        // when new message is published by the Twilio part, print it and
        // create new task based on its content
        const command = event.message.value.event.Command;
        console.log('Received published message:', JSON.stringify(event));

        client.taskrouter.workspaces(workspace)
          .tasks
          .create({
            attributes: JSON.stringify({ command }),
            workflowSid: workflow,
            taskChannel: iotTaskchannel
          })
          .then(task => console.log("New task created:", task.sid, "\n"));
      });
    })
    .catch(error => {
      console.log('Unexpected error: ', error);
    })
})
