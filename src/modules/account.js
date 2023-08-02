import bcryptjs from "bcryptjs";
import database from "../utils/database.js";

export default class Account {
    async getFromEmail(email) {
        const result = await database.accounts.findFirst({
            where: {
                email: email,
            },
        });

        if (!result) {
            throw new Error("Não existe nenhuma conta em nosso sistema com o email informado.");
        }

        return result;
    }

    async isEmailUsed(email) {
        const result = await database.accounts.findFirst({
            where: {
                email: email,
            },
        });

        if (result) {
            throw new Error("Esse email já está sendo usado em nosso sistema.");
        }

        return result;
    }

    async isUsernameUsed(username) {
        const result = await database.accounts.findUnique({
            where: {
                username: username,
            },
        });

        if (result) {
            throw new Error("Esse usuário já está sendo usado em nosso sistema.");
        }

        return result;
    }

    async create(data) {
        await this.isEmailUsed(data.email);
        await this.isUsernameUsed(data.username);
        const password = await this.hash(data.password);
        const result = await database.accounts.create({
            data: {
                email: data.email,
                username: data.username,
                password: password,
            },
        });

        return result;
    }

    async hash(password) {
        return await bcryptjs.hash(password, 10);
    }

    async compare(providedPassword, storedPassword) {
        const passwordMatches = await bcryptjs.compare(providedPassword, storedPassword);
        if (!passwordMatches) {
            throw new Error("Verifique se a senha informada está correta e tente novamente.");
        }
    }
}
