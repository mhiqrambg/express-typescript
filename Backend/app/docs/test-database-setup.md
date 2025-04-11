# Test Database Setup Guide

This guide explains how to set up and use the test database for running tests in this project.

## Overview

The project is configured to use a separate database for testing called `test_database`. This ensures that your tests don't interfere with your development or production data.

## Setup Instructions

### 1. Create the Test Database

You can create the test database manually using PostgreSQL commands:

```bash
creatdb test_database
```

Or use the provided setup script:

```bash
npm run setup:test-db
```

This script will check if the test database exists and create it if it doesn't.

### 2. Environment Configuration

The project includes a `.env.test` file with the test database configuration. Make sure this file has the correct credentials for your PostgreSQL installation.

Default test database configuration:
- Host: localhost
- Port: 5432
- User: admin
- Password: admin123
- Database: test_database

### 3. Running Tests

When you run tests using the npm test commands, the system automatically uses the test database configuration:

```bash
npm test
```

Or for watching mode:

```bash
npm run test:watch
```

## How It Works

1. The `NODE_ENV=test` environment variable is set when running tests
2. The database configuration in `app/db/config.ts` detects the test environment
3. The test setup file in `app/tests/setup.ts` ensures the correct database is used
4. Tests run against the isolated test database

## Resetting Test Data

The test setup includes a `resetTestDatabase()` function that can be used to clean up the database between test runs. You can call this function in your test files when needed.

```typescript
import { resetTestDatabase } from '../setup';

beforeEach(async () => {
  await resetTestDatabase();
});
```

## Troubleshooting

If you encounter issues with the test database:

1. Ensure PostgreSQL is running
2. Verify your database credentials in `.env.test`
3. Check that the test database exists
4. Run the setup script: `npm run setup:test-db`