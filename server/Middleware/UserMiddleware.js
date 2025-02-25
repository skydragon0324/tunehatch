import { displayUID } from "../Services/cleaningService.js";

export function testAuth(req, res, next) {
    console.log("Authenticated")
    next();
}

export function userAuth(req, res, next) {
    try {
        let SECRET_UID;
        if (Array.isArray(req.body.SECRET_UID)) {
            SECRET_UID = req.body.SECRET_UID[0]
        } else {
            SECRET_UID = req.body.SECRET_UID
        }
        const uid = displayUID(SECRET_UID);
        if (uid) {
            res.locals.uid = uid
            next();
        } else {
            throw new Error("UID_ERROR")
        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}

export function optionalUserAuth(req, res, next) {
    try {
        if (req.body.SECRET_UID) {
            const uid = displayUID(req.body.SECRET_UID);
            if (uid) {
                res.locals.uid = uid
            } else {
                res.locals.uid = null
            }
        } else {
            res.locals.uid = null
        }
        next();
    } catch (err) {
        console.log(err)
        next(err)
    }
}