const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*** All routes ***/
app.get('/', async (req, res) => {
    res.send('GOT IT?');
});

app.post('/uploadPhoto', (req, res) => {
    // console.log('file', req.files);
    const file = req.files.photo;

    file.mv("./" + file.name + '.jpg', (err, result) => {
        if(err) {
            res.send({ message: 'failed' });
            throw err;
        }
        else {
            res.send({ message: 'success' });
        }
    })
});

// in case of a wrong route creating a fallback.
app.all('*', (req, res) => { res.send("Wrong route, please try again.") });

app.listen(port, () => console.log(`Listening on port ${port}`));