import { COHOST_PERMISSION_CHUNK } from '../../src/Helpers/shared_dist/permissionsConfig.js'
import { checkShowPermissions, checkVenuePermissions } from "../Services/DBServices/dbHelperService.js";
import { checkSRGStatus } from "../Services/DBServices/dbSRService.js";

export async function verifyPermissions(req, res, next) {
    try {
        res.locals.permissions = await checkVenuePermissions(res.locals.uid, (req.body.venueID || req.body.form?.venueID))
        res.locals.venueID = req.body.venueID;
        next();
    } catch (err) {
        next(err)
    }  
}

export async function verifyShowPermissions(req, res, next) {
    try {
        res.locals.permissions = await checkVenuePermissions(res.locals.uid, (req.body.venueID || req.body.form?.venueID));
        res.locals.venueID = (req.body.venueID || req.body.form?.venueID);
        res.locals.showAdmin = await checkShowPermissions(res.locals.uid, (req.body.showID || req.body.form?.showID));
        if (res.locals.showAdmin) {
            res.locals.permissions = {
                ...res.locals.permissions,
                ...COHOST_PERMISSION_CHUNK
            }
        }
        next();
    } catch (err) {
        next(err);
    }
}

export async function verifySRGOwnership(req, res, next) {
    try {
        res.locals.SRGAdmin = await checkSRGStatus(res.locals.uid, req.body.SRID);
        if (res.locals.SRGAdmin) {
            next();
        } else {
            throw new Error("PERMISSION_DENIED")
        }
    } catch (err) {
        next(err);
    }
}
