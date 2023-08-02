import express from "express";
import color from "../utils/color.js";
import { __dirname } from "../utils/dirname.js";
import { loadFolder } from "../utils/loader.js";

export default class API {
    constructor() {
        this.app = express();
    }

    async setup() {
        return new Promise(resolve => {
            this.app.use(express.urlencoded({ extended: true }));
            this.app.use(express.json());
            this.app.listen(process.env.HTTP_PORT, () => {
                console.log(`${color.fg.cyan}[INFO]${color.reset} - API is now online at IP 0.0.0.0 and port ${process.env.HTTP_PORT}.`);
                resolve();
            });
        });
    }

    async load(account, validator) {
        const path = __dirname(import.meta);
        const files = await loadFolder(`${path}/../routes`);
        for (const file of files) {
            const data = new file.content.default(account, validator);
            await data.init();
            this.app.use("/api", data.router);
            console.log(`${color.fg.cyan}[INFO]${color.reset} - Route ${color.bright}${data.name}${color.reset} was successfully initialized.`);
        }
    }

    async init(account, validator) {
        await this.setup();
        await this.load(account, validator);
    }
}
