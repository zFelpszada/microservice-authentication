import Controller from "../utils/controller.js";

export default class Register extends Controller {
    constructor(account, validator) {
        super({ name: "register" });
        this.account = account;
        this.validator = validator;
    }

    async post(request, response) {
        let account;
        try {
            const insecureInputValues = await request.body;
            const secureInputValues = this.validator.verify(insecureInputValues, {
                email: "required",
                username: "required",
                password: "required",
            });

            account = await this.account.create(secureInputValues);
        } catch (error) {
            return response.status(404).json({
                message: error.message,
            });
        }

        return response.status(201).json(account);
    }

    async init() {
        this.router.post("/register", (req, res) => this.post(req, res));
    }
}
