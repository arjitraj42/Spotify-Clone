const express = require("express")
const cookieparser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")
const userRoutes = require("./routes/user.routes")
const playlistRoutes = require("./routes/playlist.routes")

const app = express();
app.use(express.json());
app.use(cookieparser());


app.use('/api/auth', authRoutes)
app.use('/api/music', musicRoutes)
app.use('/api/user', userRoutes)
app.use('/api/playlist', playlistRoutes)
module.exports = app;


