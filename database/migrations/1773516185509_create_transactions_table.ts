// database/migrations/1773516185509_create_transactions_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // Referência ao Cliente
      table.integer('client_id').unsigned().references('id').inTable('clients').notNullable().onDelete('CASCADE')
      
      table.integer('gateway_id').unsigned().references('id').inTable('gateways').nullable().onDelete('SET NULL')
      
      table.integer('amount').notNullable()
      table.string('gateway_name').notNullable()
      table.string('external_id').nullable()
      table.enum('status', ['paid', 'failed', 'refunded']).defaultTo('failed')
      table.string('card_last_numbers', 4).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}