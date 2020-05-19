const express = require('express');
const app = express();

app.get('/', (req, res) => {

    res.json({ env: process.env, req, res })
});

const port  = process.env.PORT || 8080;

app.listen(port, () => console.log(`Gator app listening on port ${port}!`));
