import Controller from "../utils/controller.js";

export default class Login extends Controller {
    constructor(account, validator) {
        super({ name: "login" });

        this.account = account;
        this.validator = validator;
    }

    async post(request, response) {
        try {
            const insecureInputValues = await request.body;
            const secureInputValues = this.validator.verify(insecureInputValues, {
                email: "required",
                password: "required",
            });

            const account = await this.account.getFromEmail(secureInputValues.email);
            await this.account.compare(secureInputValues.password, account.password);
        } catch (error) {
            return response.status(404).json({
                message: error.message,
            });
        }

        return response.status(202).json({
            success: true,
        });
    }

    async init() {
        this.router.post("/login", (req, res) => this.post(req, res));
    }
}
