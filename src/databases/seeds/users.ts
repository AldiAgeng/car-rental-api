import { Knex } from "knex";
import { hashPassword } from "../../utils/bcrypt.password";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { id: 1, name: "Super Admin", email: "superadmincar@yopmail.com", password: await hashPassword("superadmincar"), role_id: 1 },
    ]);
};
