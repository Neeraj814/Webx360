import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Check if cookies exist and contain the token
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // 2. Verify Token
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        // 3. User ID ko request object mein save karein
        req.id = decode.userId;
        next();

    } catch (error) {
        // 🟢 Agar token expire ho gaya ya corrupt hai, toh ye error pakdega
        console.log("Auth Error:", error.message);
        return res.status(401).json({
            message: "Authentication failed or token expired",
            success: false
        });
    }
}

export default isAuthenticated;
