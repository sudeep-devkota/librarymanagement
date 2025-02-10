const express = require("express");
const app = express();
const connectDB =require("./configuration/database");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on localhost:${port}`);
});



