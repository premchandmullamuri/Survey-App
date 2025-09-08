import jwt from "jsonwebtoken";
export function requireEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env ${name}`);
    return v;
}
const JWT_SECRET = requireEnv("JWT_SECRET");
export function authMiddleware(req, res, next) {
    const header = req.headers["authorization"];
    if (!header)
        return res.status(401).json({ error: "Missing Authorization header" });
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token)
        return res.status(401).json({ error: "Invalid Authorization header" });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
