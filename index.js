const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const routes = require("./routes");

dotenv.config();

const app = express();

connectDB();

app.use(express.static('./uploads'));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/v1", routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`[+] Server is running at http://localhost:${PORT}`);
});
