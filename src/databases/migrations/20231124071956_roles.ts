import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.string('description', 255).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('roles')
}
