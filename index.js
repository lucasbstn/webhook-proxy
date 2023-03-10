const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { healthz } = require('express-healthz');

const app = express();

app.use(healthz);

app.use('/ical', bodyParser.json(), async (req, res) => {
    try {
        const data = {
            'token':req.query.token
        };

        const url = `${process.env.APPWRITE_ENDPOINT}/functions/${process.env.APPWRITE_FUNCTION_ID}/executions`;

        const body = {
            async: false,
            data: JSON.stringify(data)
        };

        const headers = {
            'Content-Type': 'application/json',
            'x-appwrite-key': process.env.APPWRITE_API_KEY,
            'x-appwrite-project': process.env.APPWRITE_PROJECT_ID
        };

        const response = await axios.post(
            url,
            body,
            {
                headers
            }
        );
        res.type('text/calendar')
        res.send(response.data.response);
    } catch(err) {
        // Axios error
        if (err.response) {
            res.status(err.response.status);
            res.json({
                data: err.response.data,
                code: err.response.status,
            });
            return;
        }

        // Generic error
        res.status(500);
        res.json({
            data: "Unexpected server error: " + (err.message ? err.message : err),
            code: 500,
        });
    }
});

app.use(express.static('site'));

app.listen(process.env.PORT);
