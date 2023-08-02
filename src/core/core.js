import color from "../utils/color.js";

export default class Core {
    constructor(api, account, validator) {
        this.api = api;
        this.account = account;
        this.validator = validator;
    }

    async init() {
        await this.api.init(this.account, this.validator);
        console.log(`${color.fg.green}[READY]${color.reset} - Microservice is ready.`);
    }
}
