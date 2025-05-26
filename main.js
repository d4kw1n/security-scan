const express = require('express');
const app = express();
const { Expression } = require('expr-eval');

app.get('/eval1', (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('No code provided');
    }
    try {
        const result = eval(code);
        res.send(`Result: ${result}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}
);

app.get('/', (req, res) => res.send('Hello World!'));




app.listen(3000, () => console.log('Server running on port 3000'));