import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table: Knex.TableBuilder) => {
    table.integer("role_id");
    table.foreign("role_id").references("id").inTable("roles");
  })
}


export async function down(knex: Knex): Promise<void> {
  
}

