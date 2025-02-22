const express = require("express");
const app = express();
const connectDB =require("./configuration/database");
connectDB();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const viewPath = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", viewPath);

//render ejs
app.get("/signup", (req, res) => {
    res.render("auth/signup"

    );
});
app.get("/login", (req, res) => {
    res.render("auth/login");});

app.get("/auth/student", (req, res) => {
    res.render("auth/student");
});
app.get("/auth/admin", (req, res) => {
    res.render("auth/admin");
});








app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const bookRoute = require("./routes/book");
app.use("/book", bookRoute);



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on localhost:${port}`);
});



