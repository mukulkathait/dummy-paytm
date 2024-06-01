import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    console.log("authHeader: ", authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            success: false,
            message: "Authorization header not found "
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "User Authentication FAILED!!",
            error: err
        })
    }
}

export default authMiddleware