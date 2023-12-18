import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema.createTable('articles', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('title', 255).notNullable()
    table.text('body').notNullable()
    table.boolean('approved').notNullable().defaultTo(false)
    table.text('image').nullable()
    table.string('image_public_id').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<any> {
  await knex.schema.dropTable('articles')
}
