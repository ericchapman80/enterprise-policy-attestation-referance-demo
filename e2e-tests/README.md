# End-to-End Functional Tests

This directory contains end-to-end functional tests for the Commerce Demo application. These tests provide evidence of functional testing for critical user flows.

## Test Coverage

The functional tests cover the following critical user flows:

1. **Product Listing Page**
   - Displaying product cards with correct information
   - Filtering products by category
   - Navigating to product detail page

2. **Product Detail Page**
   - Displaying product details correctly
   - Selecting product variants
   - Adjusting quantity and adding to cart
   - Viewing product reviews

3. **API Integration**
   - Backend API returns product data correctly
   - Backend API returns single product details correctly
   - Backend API handles error cases properly

## Running the Tests

To run the tests, follow these steps:

1. Install Playwright browsers:
   ```
   npx playwright install
   ```

2. Start the application (if not already running):
   ```
   cd .. && docker-compose up -d
   ```

3. Run the tests:
   ```
   npm test
   ```

4. Run tests with browser UI visible:
   ```
   npm run test:headed
   ```

5. View the test report:
   ```
   npm run report
   ```

## Test Evidence

The tests generate screenshots as evidence of functional testing. These screenshots are stored in the `tests/screenshots` directory and can be used to demonstrate that the application functions correctly.

## CI Integration

These tests can be integrated into a CI/CD pipeline to provide continuous validation of the application's functionality. The tests are configured to run in a Docker environment, making them suitable for CI/CD integration.
