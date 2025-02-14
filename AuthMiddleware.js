import {TokenDecode} from "../utility/tokenUtility.js";

export default async (req, res, next) => {
    let token = req.headers['token']
    console.log(token)
    let decoded = await TokenDecode(token)
    console.log(decoded)
    if (decoded === null) {
        res.status(401).json({status: "fail", message: "Unauthorized"})
    } else {
        let email = decoded.email;
        let user_id = decoded.user_id;
        req.headers.email = email;
        req.headers.user_id = user_id;
        next()
    }

}

