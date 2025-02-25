import { ERROR_MAP } from '../Config/errors.config.js';

/**
 * errorHandler
 * Error handling middleware
 * @param {string} err Passed error from previous route
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 */
export function errorHandler(err, req, res, next) {
    const errName = err.message.replace("Error: ", "");
    var errData
    if (ERROR_MAP[errName]) {
        errData = ERROR_MAP[errName]
        console.log(errData.message)
    } else {
        errData = { status: 500, message: "Server Error" }
        console.log(err)
    }
    

    res.status(errData.status).send(errData.message);
}