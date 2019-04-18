exports.handler = function (context, event, callback) {
  let response = new Twilio.Response();
  console.log(JSON.stringify(event));
  console.log(event.Command);
  const client = context.getTwilioClient();

  client.sync.services(context.SYNC_SERVICE_SID)
    .syncStreams('IoT_Alerts')
    .streamMessages
    .create({
      data: {
        event
      }
    })
    .then(stream_message => {
      console.log(stream_message.sid);
      callback(null, response);
    });
};
