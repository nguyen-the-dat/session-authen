const express = require("express");
const app = express();
const port = 3003;
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extends: true })); // cho phep nhan va xu ly form trong express o backend
const sessions = new Map();
const db = {
  users: [
    {
      id: 1,
      email: "nguyenvana@gmail.com",
      password: "123456",
      name: "Nguyen Van A",
    },
  ],
};

// [get] : homepage

app.get("/", (req, res) => {
  res.render("pages/index");
});

// [get] : /login

app.get("/login", (req, res) => {
  res.render("pages/login");
});

// [post] : /login

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    const sessionId = Date.now().toString();

    // set session for server
    sessions.set(sessionId, {
      userId: user.id,
    });
    // console.log(sessions);
    res
      .setHeader("Set-Cookie", `sessionId=${sessionId}; max-age=3600; httpOnly`)
      .redirect("dashboard");
    // console.log(`day la ${req.cookies.sessionId}`);
    return;
  }
  res.send("Username or password is in correct");
});

// [get] : /dashboard
app.get("/dashboard", (req, res) => {
  //   console.log(`sessions trong dashboard la ${sessions}`);
  const session = req.cookies.sessionId;
  if (!session) {
    // chua dang nhap
    return res.redirect("login");
  }
  const { userId } = sessions.get(session);
  const userInfo = db.users.find((user) => user.id === userId);
  if (!userInfo) {
    return res.redirect("/login");
  }
  console.log("log trong dashboard");
  sessions.forEach((value, key) => {
    console.log(`Key: ${key}, Value:`, value);
  });
  res.render("pages/dashboard", { userInfo });
});

// [get] : /logout

app.get("/logout", (req, res) => {
  // xoa session
  const session = req.cookies.sessionId;

  sessions.delete(session);
  res.setHeader("Set-Cookie", "sessionId=;max-age=0").redirect("login");
  console.log("log in logout");
  sessions.forEach((value, key) => {
    console.log(`Key: ${key}, Value:`, value);
  });
});

app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
