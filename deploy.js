const express = require("express");
const { default: ParseServer, ParseGraphQLServer } = require("parse-server");
const Parse = require("parse/node");
const path = require("path");
const app = express();

const port = 1337;
const appId = "myAppId";
const serverURL = "http://localhost:1337/parse";


class Broadcasts extends Parse.Object {
  constructor() {
    super('Broadcasts')
  }
}

class Recipients extends Parse.Object {
  constructor() {
    super('Recipients')
  }
}

Parse.initialize(appId);
Parse.serverURL = serverURL;
Parse.Object.registerSubclass('Broadcasts', Broadcasts);
Parse.Object.registerSubclass('Recipients', Recipients);

const mongodbURI =
	"mongodb+srv://chunder:JwawCKQhofeLCOPP@cluster0-6auyg.mongodb.net/test?retryWrites=true&w=majority";
const parseServer = new ParseServer({
	databaseURI: mongodbURI,
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + "/cloud/main.js",
	appId,
	masterKey: process.env.MASTER_KEY || "",
	serverURL: serverURL,
	liveQuery: {
		classNames: [""],
	},
});

const parseGraphQLServer = new ParseGraphQLServer(parseServer, {
	graphQLPath: "/graphql",
	playgroundPath: "/playground",
});

app.get("/", async (req, res) => {
  const broadcasts = new Broadcasts();
  const recipients = new Recipients();
  broadcasts.set('friendlyName', 'Test 123');
  broadcasts.set('message', 'This is a test message');
  broadcasts.set('from', '+4545532312')
  broadcasts.set('channel', 'voice')
  recipients.set('recipients', { to: '+34222333222', status: 'completed' })
  broadcasts.set('recipients', recipients);
  try {
    const saved = await broadcasts.save({ name: 'tomeu' });
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use("/parse", parseServer.app); // (Optional) Mounts the REST API
parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
parseGraphQLServer.applyPlayground(app); // (Optional) Mounts the GraphQL Playground - do NOT use in Production

app.listen(port, function () {
	console.log("REST API running on http://localhost:1337/parse");
	console.log("GraphQL API running on http://localhost:1337/graphql");
	console.log("GraphQL Playground running on http://localhost:1337/playground");
});
