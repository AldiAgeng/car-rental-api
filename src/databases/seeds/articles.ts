import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("articles").del();

  // Inserts seed entries
  await knex("articles").insert([
    {
      id: 1,
      title: "Jakarta Sedang Bagus Bagusnya",
      body: "Ini isi berita",
      approved: true,
    },
  ]);
}
