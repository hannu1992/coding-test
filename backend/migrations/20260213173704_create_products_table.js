/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("products", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("slug").notNullable().unique();
    table.integer("quantity").notNullable().defaultTo(0);

    table.index(["name"]);
    table.index(["quantity"]);

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("products");
};
