# Jest Testing Documentation

This document provides a comprehensive guide to the Jest testing implementation in this project, covering setup, configuration, mocking strategies, and best practices.

## 1. Project Test Setup

The project uses Jest as the primary testing framework for unit and integration tests. Tests are written in TypeScript and configured to work with the Node.js environment.

### 1.1 Directory Structure

javascript

/app/tests/                  - Main test directory
├── helpers/               - Test helper functions
│   └── dbHelpers.ts       - Database-related test helpers
├── jest.setup.ts          - Jest setup configuration
└── users.test.ts          - User-related tests
/jest.config.ts              - Jest configuration file

### 1.2 Configuration

Jest is configured in the root jest.config.ts file with the following settings:
Uses ts-jest preset for TypeScript support
Node.js test environment
Test files are located in /app/tests/ with .test.ts extension
Module path aliases for easier imports (@services, @models, @tests)
Setup file at /app/tests/jest.setup.ts runs before tests

## 2. Test Database Setup

The project uses a separate test database to isolate test data from production. Environment variables are configured in jest.setup.ts to ensure tests use the test database.

### 2.1 Database Helpers

The dbHelpers.ts file provides utility functions for test database operations:
setupTestDb(): Creates necessary tables and prepares the test environment
cleanDb(): Cleans all test data between test runs
createTestUser(): Creates a test user with default or custom properties
getUserById(): Retrieves a user by ID (currently unused in tests)
query(): Executes custom SQL queries (currently unused in tests)
beginTransaction() & rollbackTransaction(): Transaction helpers (currently unused)

## 3. Mocking Strategy

The project uses Jest's mocking capabilities to isolate tests from external dependencies.

### 3.1 Service Mocking

In users.test.ts, the userService is mocked to avoid making real HTTP calls:
Mock functions are created for each service method (create, get, one)
The entire module is mocked using jest.mock()
Each test configures the mock's return value for its specific scenario
Example:
typescript

```mermaid
// Mock the userService
const mockUserService = {
  create: jest.fn(),
  get: jest.fn(),
  one: jest.fn()
};

// Mock the entire module
jest.mock('@services/user.service', () => ({
  userService: mockUserService
}));
```

## 4. Test Lifecycle Hooks

Jest provides lifecycle hooks to set up and tear down test environments:
beforeAll(): Runs once before all tests (used to set up test database)
afterAll(): Runs once after all tests (used to close database connections)
afterEach(): Runs after each test (used to clean database between tests)

# 5. Test Examples

The project includes tests for user-related functionality:

## 5.1 Create User Test

Tests the user creation functionality by mocking the service response and verifying the expected output.
typescript

```marmaid
describe('Testing - Create', () => {
  it('should create a new user', async () => {
    const userData = {
      name: "MUH. IQRAM BAHRING",
      email: "test_user@example.com",
      password: "securePassword123", 
      role: "user"
    };
  
    // Mock the response for this test
    mockUserService.create.mockResolvedValue({
      success: "success",
      message: "User created successfully",
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    });
  
    const result = await mockUserService.create(userData);
  
    expect(result.success).toBe("success");
    expect(result.data.name).toBe(userData.name);
    expect(result.data.email).toBe(userData.email);
    expect(result.data.role).toBe(userData.role);
  });
});
```

## 5.2 Get All Users Test

Tests the functionality to retrieve all users by mocking the service response and verifying the expected output.
typescript

```marmaid
describe('Testing - GetAll', () => {
  it('should fetch users successfully', async () => {
    // Create a couple test users
    const user1 = await createTestUser();
    const user2 = await createTestUser({ email: "second@example.com" });
  
    // Mock the response for this test
    mockUserService.get.mockResolvedValue({
      success: "success",
      message: "Users retrieved successfully",
      data: [user1, user2]
    });
  
    const result = await mockUserService.get();
  
    expect(result.success).toBe("success");
    expect(result.message).toBe("Users retrieved successfully");
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(2);
  });
});
```

## 5.3 Get User By ID Test

Tests the functionality to retrieve a specific user by ID by mocking the service response and verifying the expected output.
typescript

```describe('Testing - GetOne', () => { it('should fetch a user by ID successfully', async () => { // Create a test user and get its ID const user = await createTestUser();// Mock the response for this test mockUserService.one.mockResolvedValue({ success: "success", message: "User retrieved successfully", data: user });// Get the user by ID const result = await mockUserService.one(user.id);expect(result.success).toBe("success"); expect(result.message).toBe("User retrieved successfully"); expect(result.data.id).toBe(user.id); expect(result.data.email).toBe(user.email);}); });```

## 6. Running Tests

The project includes several npm scripts for running tests:
npm run test: Runs all tests once
npm run test:watch: Runs tests in watch mode (re-runs on file changes)
npm run test:coverage: Runs tests and generates coverage report

## 7. Unused Code and Optimization Opportunities

The following items were identified as unused or potentially optimizable:
In dbHelpers.ts: The functions getUserById(), query(), beginTransaction(), and rollbackTransaction() are defined but not used in the current tests
The Transaction Test describe block in dbHelpers.ts appears to be example code that isn't being used in actual tests
In user.service.ts: All imports are being used correctly, and all functions are utilized in tests

## 8. Best Practices

Keep tests isolated: Each test should be independent of others
Clean up after tests: Use afterEach to reset state between tests
Mock external dependencies: Avoid making real API calls in tests
Use descriptive test names: Clearly describe what each test is verifying
Group related tests: Use describe blocks to organize tests logically
Avoid test interdependence: Tests should not depend on the order of execution

