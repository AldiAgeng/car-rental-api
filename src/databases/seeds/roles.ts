import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("roles").del();

    // Inserts seed entries
    await knex("roles").insert([
        { id: 1, name: "Super Admin", description: "Super Admin" },
        { id: 2, name: "Admin", description: "Admin" },
        { id: 3, name: "Member", description: "Member" }
    ]);
};
