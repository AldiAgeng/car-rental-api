import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('cars', (table: Knex.TableBuilder) => {
    table.increments('id').primary().notNullable()
    table.string('plate').notNullable()
    table.string('manufacture').notNullable()
    table.string('model').notNullable()
    table.text('image').notNullable()
    table.string('image_public_id').notNullable()
    table.integer('rent_per_day').notNullable()
    table.integer('capacity').notNullable()
    table.text('description').notNullable()
    table.dateTime('available_at').notNullable()
    table.enum('transmission', ['manual', 'automatic']).notNullable()
    table.boolean('available').notNullable()
    table.string('type').notNullable()
    table.integer('year').notNullable()
    table.jsonb('options').notNullable()
    table.jsonb('specs').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('cars')
}
