import { Database as Arango } from "arangojs";

/*Database Configuration*/
const DBURL = process.env.DB_URL;
const DBNAME = process.env.DB_NAME;
const DBUSR = process.env.DB_USER;
const DBPWD = process.env.DB_PASS;
var agentOptions;
if (process.env.NODE_ENV === 'development') {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    agentOptions = { rejectUnauthorized: false };
}

export const db = new Arango({
    url: DBURL,
    databaseName: DBNAME,
    auth: { username: DBUSR, password: DBPWD },
    agentOptions: agentOptions
 })