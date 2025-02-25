import { createSRGroup, editSRGroup } from "../Services/DBServices/dbSRService.js";

const _createSRGroup = async (req, res, next) => {
    try {
        const group = await createSRGroup(res.locals.uid, req.body, req.files);
        res.send(group);
    } catch (err) {
        throw err;
    }
};
export { _createSRGroup as createSRGroup };

const _editSRGroup = async (req, res, next) => { 
    try {
        const group = await editSRGroup(res.locals.uid, req.body, req.files)
        res.send(group)
    } catch (err) {
        throw err;
    }
}

export { _editSRGroup as editSRGroup };