import Core from "./core/core.js";
import API from "./modules/api.js";
import Account from "./modules/account.js";
import Validator from "./modules/validator.js";
import * as dotenv from "dotenv";

dotenv.config();

const api = new API();
const account = new Account();
const validator = new Validator();
const core = new Core(api, account, validator);
core.init();
