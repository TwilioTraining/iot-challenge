exports.handler = function (context, event, callback) {
  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const token = new AccessToken(
    context.ACCOUNT_SID,
    context.SYNC_API_KEY,
    context.SYNC_API_SECRET,
    { ttl: 3600 }
  );

  let response = new Twilio.Response();
  response.setHeaders({
    "Access-Control-Allow-Origin": "*"
  })

  token.identity = "flex_plugin";

  const syncGrant = new SyncGrant({
    serviceSid: context.SYNC_SERVICE_SID
  });
  token.addGrant(syncGrant);

  // Serialize the token to a JWT string
  console.log(token.toJwt());
  response.setBody(token.toJwt());

  callback(null, response);
};
