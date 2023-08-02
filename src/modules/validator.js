import Joi from "joi";

export default class Validaor {
    constructor() {
        this.schemas = {
            id: function () {
                return Joi.object({
                    id: Joi.string().allow(null).trim().guid({ version: "uuidv4" }).when("$required.id", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                        "any.required": `"id" é um campo obrigatório.`,
                        "string.empty": `"id" não pode estar em branco.`,
                        "string.base": `"id" deve ser do tipo String.`,
                        "string.guid": `"id" deve possuir um token UUID na versão 4.`,
                    }),
                });
            },

            username: function () {
                return Joi.object({
                    username: Joi.string().alphanum().min(3).max(30).trim().invalid(null).when("$required.username", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                        "any.required": `"usuário" é um campo obrigatório.`,
                        "string.empty": `"usuário" não pode estar em branco.`,
                        "string.base": `"usuário" deve ser do tipo String.`,
                        "string.alphanum": `"usuário" deve conter apenas caracteres alfanuméricos.`,
                        "string.min": `"usuário" deve conter no mínimo {#limit} caracteres.`,
                        "string.max": `"usuário" deve conter no máximo {#limit} caracteres.`,
                        "any.invalid": `"usuário" possui o valor inválido "null".`,
                    }),
                });
            },

            email: function () {
                return Joi.object({
                    email: Joi.string().email().min(7).max(254).lowercase().trim().invalid(null).when("$required.email", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                        "any.required": `"email" é um campo obrigatório.`,
                        "string.empty": `"email" não pode estar em branco.`,
                        "string.base": `"email" deve ser do tipo String.`,
                        "string.email": `"email" deve conter um email válido.`,
                        "any.invalid": `"email" possui o valor inválido "null".`,
                    }),
                });
            },

            password: function () {
                return Joi.object({
                    password: Joi.string().min(8).max(72).trim().invalid(null).when("$required.password", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                        "any.required": `"password" é um campo obrigatório.`,
                        "string.empty": `"password" não pode estar em branco.`,
                        "string.base": `"password" deve ser do tipo String.`,
                        "string.min": `"password" deve conter no mínimo {#limit} caracteres.`,
                        "string.max": `"password" deve conter no máximo {#limit} caracteres.`,
                        "any.invalid": `"password" possui o valor inválido "null".`,
                    }),
                });
            },
        };
    }

    verify(object, keys) {
        try {
            const json = JSON.stringify(object);
            object = JSON.parse(json);
        } catch (error) {
            throw new Error("Verifique se o valor enviado é um JSON válido.");
        }

        let verifySchema = Joi.object().required().min(1).messages({
            "object.base": `Body enviado deve ser do tipo Object.`,
            "object.min": `Objeto enviado deve ter no mínimo uma chave.`,
        });

        for (const key of Object.keys(keys)) {
            const keyValidationFunction = this.schemas[key];
            verifySchema = verifySchema.concat(keyValidationFunction());
        }

        const { error, value } = verifySchema.validate(object, {
            escapeHtml: true,
            stripUnknown: true,
            context: {
                required: keys,
            },
        });

        if (error) {
            throw new Error(error.details[0].message);
        }
        return value;
    }
}
