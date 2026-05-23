const jwt = require("jsonwebtoken")

async function authArtist(req, res, next) {
     
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: "User unauthorized"});
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}


async function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({message: "Unauthorized"});
        }

        req.user = decoded;

        next();

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}



module.exports = { authArtist, authUser };