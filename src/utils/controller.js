import { Router } from "express";

export default class Controller {
    constructor(options = {}) {
        this.name = options?.name;
        this.router = Router();
    }
}
