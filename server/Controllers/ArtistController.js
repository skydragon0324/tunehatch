import { apply, upsertArtistContactNumber } from "../Services/DBServices/dbArtistService.js";
import { calculatePayouts } from "../Services/DBServices/dbFinanceService.js";
import { getStripeStatus } from "../Services/apiService.js";
import { respondToPerformance, showrunnerApply } from "../Services/DBServices/dbIndustryService.js";

const _apply = async (req, res, next) => {
    try {
        var result;
        if(res.locals.uid !== req.body.id){
            // showrunner app
            result = await showrunnerApply(req.body.showID, req.body.id, req.body.phone);
        }else{
            result = await apply(req.body.venueID, req.body.showID, res.locals.uid, req.body.phone);
        }
        if(req.body.phone) {
            await upsertArtistContactNumber(res.locals.uid, req.body.phone);
        }
        res.send(result);
    } catch (err) {
        next(err);
    }
};
export { _apply as apply };

const _respondToPerformance = async (req, res, next) => {
    try {
        const result = await respondToPerformance("artist", res.locals.uid, res.locals.uid, req.body.showID, req.body.status);  
        res.send(result);
    } catch (err) {
        next(err);
    }
};
export { _respondToPerformance as respondToPerformance };

const _calculatePayouts = async (req, res, next) => {
    try {
        const result = await calculatePayouts(req.body.showID);
        res.send({ _key: result._key, payouts: {[res.locals.uid]: result.payouts[res.locals.uid] } })
    } catch (err) {
        next(err);
    }
}

export { _calculatePayouts as calculatePayouts };

const _getStripeStatus = async (req, res, next) => {
    const { accountID, id, type } = req.body;
    try {
        const response = await getStripeStatus(accountID, id, type);
    res.json(response); // Send the response as JSON
    } catch (err) {
        next(err)
    }
}

export { _getStripeStatus as getStripeStatus };