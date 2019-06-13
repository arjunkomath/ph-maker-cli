const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fetch = require('node-fetch')

const {
  PH_API_HOST,
  PH_APP_API_KEY,
  PH_APP_REQUESTED_SCOPES,
  PH_APP_REDIRECT_URI,
  PH_APP_API_SECRET
} = process.env;

async function fetchToken(requestBody) {
  const response = await fetch(`${PH_API_HOST}v2/oauth/token`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const tokenJSON = await response.json();

  return tokenJSON && tokenJSON.access_token;
}


app.get('/', async (req, res) => {
  if (req.query && req.query.code) {
    const accessToken = await fetchToken({
      code: req.query && req.query.code,
      client_id: PH_APP_API_KEY,
      client_secret: PH_APP_API_SECRET,
      redirect_uri: PH_APP_REDIRECT_URI,
      grant_type: "authorization_code"
    });

    return res.send(`<h4>Your Access Token: <b>${accessToken}</b></h4>`);
  }

  return res.redirect(
    `${PH_API_HOST}v2/oauth/authorize?client_id=${PH_APP_API_KEY}&redirect_uri=${PH_APP_REDIRECT_URI}&response_type=code&scope=${PH_APP_REQUESTED_SCOPES}`
  );
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
