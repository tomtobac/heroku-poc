const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

app.listen(8080, () => console.log('Gator app listening on port 3000!'));
