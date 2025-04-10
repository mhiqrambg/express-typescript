/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create the 'users' table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'), // Automatically generate UUID
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: 'varchar(255)',
      notNull: true,
    },
    role: {
      type: 'varchar(50)',
      notNull: true,
      default: "'user'", // Default role is 'user'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'), // Automatically set the creation timestamp
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'), // Automatically set the update timestamp
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the 'users' table
  pgm.dropTable('users');
};
