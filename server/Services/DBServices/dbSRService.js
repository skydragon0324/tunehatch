import { renameSync, unlinkSync } from "fs";
import path from "path";
import { db } from "../../Config/db.config.js";

import { determineUploadPaths, verifyUpload } from "../imageServices.js";
import { parseNestedData } from "../cleaningService.js";
import { parseInstagram } from "../../../src/Helpers/shared_dist/parseInstagram.js";
import { getVideoLink } from "../apiService.js";

/**
 * checkSRGStatus
 * Returns whether or not the specified user is an admin for a given group
 * @param {_key} uid User's UID
 * @param {_key} SRID Group ID
 */
export async function checkSRGStatus(uid, SRID) {
    try {
        const cursor = await db.query(`
            FOR memberdata IN sr_memberships
            FILTER memberdata._to == CONCAT("showrunners/", @SRID) && memberdata._from == CONCAT("users/", @uid)
            RETURN memberdata     
        `)
        for await (const result of cursor) {
            if (result.type === "admin") {
                return true;
            }
        }
        return false;
    } catch (err) {
        console.log("Unable to confirm SRG Admin Status")
        throw err;
    }
}

/**
 * populateSRMembers
 * Adds Showrunner Group members to database.
 * @param {_key} uid User's UID
 * @param {_key} SRID ShowRunner Group ID
 * @param {Object} memberData Object containing a user's uid
 * @param {str} status (optional) Defaults to "accepted"
 */
export async function populateSRMembers(uid, SRID, memberData, status) {
    memberData = memberData || [];
    console.log("REACHED POPULATESRMEMBERS")
    //todo: check SRG ownership
    try {
        let selfAdmin = false;
        status = status || "accepted";
        memberData.forEach((member, i) => {
            memberData[i]._to = "showrunners/" + SRID;
            memberData[i]._from = "users/" + member.id;
            memberData[i].uid = member.id
            memberData[i].type = "member"
            memberData[i].name = member.name
            memberData[i].SRID = SRID;
            memberData[i].status = status;
            if (member.id === uid) {
                memberData[i].type = "admin"
                selfAdmin = true;
            }
        })
        if (!selfAdmin) {
            memberData.push({
                _to: "showrunners/" + SRID,
                _from: "users/" + uid,
                SRID: SRID,
                type: "admin",
                status: "accepted",
            })
        }
        const bindVars = {
            memberData
        }
        const cursor = await db.query(`
            FOR member IN @memberData
            UPSERT {_to: member._to, _from: member._from}
            INSERT member
            UPDATE member IN sr_memberships
            RETURN NEW
        `, bindVars);
        const result = await cursor.all();
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
        console.log("There was an error updating SRMemberships")
        return [];
    }
}

/**
 * getSRMembers
 * Fetches all active members in an SRGroup
 * @param {_key} SRID 
 * @param {bool} onlyIDs If true, only returns UIDs of members
 */
export async function getSRMembers(SRID, onlyIDs) {
    console.log("REACHED GETSRMEMBERS")

    try {
        const bindVars = {
            group: "showrunners/" + SRID
        }
        const cursor = await db.query(`
        FOR member IN sr_memberships
        FILTER member._to == @group
        RETURN member
    `, bindVars);
        if (!onlyIDs) {
            const result = await cursor.all();
            return result;
        } else {
            let memberIDs = []
            for await (const member of cursor) {
                if (member.type !== "admin") {
                    let memberID = member._from.replace("users/", "")
                    memberIDs.push(memberID)
                }
            }
            return memberIDs
        }
    } catch (err) {
        throw err;
    }
}

export async function updateSRMembers(uid, SRID, memberData, status) {
    try {
        //fetch all SR members
        let keep = []
        let remove = []
        let add = []
        const existingMembers = await getSRMembers(SRID, true);
        memberData.forEach((newMember) => {
            if (existingMembers.includes(newMember?.id)) {
                keep.push(newMember.id);
            } else {
                add.push({ id: newMember.id, type: "member" });
            }
        })
        existingMembers.forEach((member) => {
            if (!keep.includes(member) && !add.includes(member)) {
                remove.push(member);
            }
        })
        await populateSRMembers(uid, SRID, add);
        await removeSRMembers(uid, SRID, remove)
        const bindVars = {
            SRID
        }
        const cursor = await db.query(`
        FOR member IN sr_memberships
        FILTER member._to == CONCAT("showrunners/", @SRID)
        RETURN member
        `, bindVars)
        const result = await cursor.all();
        return result;
    } catch (err) {
        throw err;
    }
}

export async function removeSRMembers(uid, SRID, memberData) {
    try {
        const bindVars = {
            SRID,
            memberData
        }
        const cursor = await db.query(`
        FOR membership IN sr_memberships
            FOR member IN @memberData
            FILTER membership._to == CONCAT("showrunners/", @SRID) && membership.type != "admin" && membership._from == CONCAT("users/", member)
            REMOVE membership._key IN sr_memberships
    `, bindVars);
        const result = await cursor.all();
        return result;
    } catch (err) {
        console.log("There was an error updating SRMemberships")
        return [];
    }
}

export async function createSRGroup(uid, form, files) {
    try {
        const required_fields = ["name"]
        let errors = [];
        delete form.SECRET_UID;
        for (let key in form) {
            form[key] = JSON.parse(form[key])
        }
        let memberData = form.roster;
        delete form.roster
        let parsedInstagram;
        let parsedTikTok;
        let parsedYoutube;
        if (form['socials.instagram']) {
            parsedInstagram = parseInstagram(form['socials.instagram'])
        }
        if (form['socials.tikTokLink']) {
            parsedTikTok = await getVideoLink(form['socials.tikTokLink'])
        }
        if (form['socials.youtubeLink']) {
            parsedYoutube = await getVideoLink(form['socials.youtubeLink'])
        }
        if (parsedTikTok) {
            form['socials.tikTokLink'] = parsedTikTok;
        } else {
            delete form['socials.tikTokLink'];
        }
        if (parsedInstagram) {
            form['socials.instagram'] = parsedInstagram
        } else {
            delete form['socials.instagram'];
        } if (parsedYoutube) {
            form['socials.youtubeLink'] = parsedYoutube;
        } else {
            delete form['socials.youtubeLink']
        }
        delete form.required_fields;
        delete form.submission_status;
        //if user verified, proceed with upload attempt
        //this should be moved to imageServices soon)
        if (files && files['avatar']) {
            let file = files['avatar'][0];
            if (verifyUpload(file)) {
                let paths = await determineUploadPaths("user", uid)
                let newFile = file.filename + path.extname(file.originalname).toLowerCase()
                let targetDir = paths.targetDir + newFile;
                let displayDir = paths.displayDir + newFile;
                await renameSync(file.path, targetDir)
                form.avatar = displayDir;
            } else {
                unlinkSync(file.path);
            }
        }
        if (files && files['banner']) {
            let file = files['banner'][0];
            if (verifyUpload(file)) {
                let paths = await determineUploadPaths("user", uid)
                let newFile = file.filename + path.extname(file.originalname).toLowerCase()
                let targetDir = paths.targetDir + newFile;
                let displayDir = paths.displayDir + newFile;
                await renameSync(file.path, targetDir)
                form['banner'] = displayDir;
            } else {
                unlinkSync(file.path);
            }
        }
        var formData = parseNestedData(form)
        //create SRGroup
        const bindVars = { formData };
        const cursor = await db.query(`
            INSERT @formData INTO showrunners
            RETURN NEW
        `, bindVars);
        const result = await cursor.next();
        const SRID = result._key;

        const members = await populateSRMembers(uid, SRID, memberData);

        return { ...result, members: members }

    } catch (err) {
        console.log(err)
        //if error, delete temp file if applicable
        if (files && files['avatar']) {
            let file = files['avatar'][0];
            unlinkSync(file.path);
        }
        if (files && files['banner']) {
            let file = files['banner'][0];
            unlinkSync(file.path);
        }
        throw err;
    }
}

export async function editSRGroup(uid, form, files) {
    try {
        const required_fields = ["name"]
        let errors = [];
        delete form.SECRET_UID;
        for (let key in form) {
            form[key] = JSON.parse(form[key])
        }
        let groupID = form.SRID;
        let memberData = form.roster;
        delete form.roster
        let parsedInstagram;
        let parsedTikTok;
        let parsedYoutube;
        if (form['socials.instagram']) {
            parsedInstagram = parseInstagram(form['socials.instagram'])
        }
        if (form['socials.tikTokLink']) {
            parsedTikTok = await getVideoLink(form['socials.tikTokLink'])
        }
        if (form['socials.youtubeLink']) {
            parsedYoutube = await getVideoLink(form['socials.youtubeLink'])
        }
        if (parsedTikTok) {
            form['socials.tikTokLink'] = parsedTikTok;
        } else {
            delete form['socials.tikTokLink'];
        }
        if (parsedInstagram) {
            form['socials.instagram'] = parsedInstagram
        } else {
            delete form['socials.instagram'];
        } if (parsedYoutube) {
            form['socials.youtubeLink'] = parsedYoutube;
        } else {
            delete form['socials.youtubeLink']
        }
        delete form.required_fields;
        delete form.submission_status;
        //if user verified, proceed with upload attempt
        if (files['avatar']) {
            let file = files['avatar'][0];
            if (verifyUpload(file)) {
                let paths = await determineUploadPaths("user", uid)
                let newFile = file.filename + path.extname(file.originalname).toLowerCase()
                let targetDir = paths.targetDir + newFile;
                let displayDir = paths.displayDir + newFile;
                await renameSync(file.path, targetDir)
                form.avatar = displayDir;
            } else {
                unlinkSync(file.path);
            }
        }
        if (files['banner']) {
            let file = files['banner'][0];
            if (verifyUpload(file)) {
                let paths = await determineUploadPaths("user", uid)
                let newFile = file.filename + path.extname(file.originalname).toLowerCase()
                let targetDir = paths.targetDir + newFile;
                let displayDir = paths.displayDir + newFile;
                await renameSync(file.path, targetDir)
                form['banner'] = displayDir;
            } else {
                unlinkSync(file.path);
            }
        }
        var formData = parseNestedData(form)
        //create SRGroup
        const bindVars = { formData, groupID };
        const cursor = await db.query(`
            FOR group IN showrunners
            UPDATE {_key: @groupID} WITH @formData IN showrunners
            RETURN NEW
        `, bindVars);
        const result = await cursor.next();
        const SRID = result._key;

        const members = await updateSRMembers(uid, SRID, memberData);

        return {
                ...result,
                members: members
            }

    } catch (err) {
        console.log(err)
        //if error, delete temp file if applicable
        if (files['avatar']) {
            let file = files['avatar'][0];
            unlinkSync(file.path);
        }
        if (files['banner']) {
            let file = files['banner'][0];
            unlinkSync(file.path);
        }
        throw err;
    }
}
