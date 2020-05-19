const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ domain: req.domain, headers: req.headers, env: process.env });
});

const port  = process.env.PORT || 8080;

app.listen(port, () => console.log(`Gator app listening on port ${port}!`));
