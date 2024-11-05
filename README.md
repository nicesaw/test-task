# enotes.pointschool

## Overview

This project is set up for automated testing using **Playwright** for test execution and **Allure** for test reporting. It contains both **end-to-end (E2E)** and **API tests**. Several scripts are defined in `package.json` to manage test execution and report generation.

## Setup

1. **Install Dependencies**

   Run the following command to install all required dependencies:

   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the root folder and add the following environment variables:

   ```bash
   USER_PASSWORD='*****'
   USER_NAME='*****'
   ```

   Replace `*****` with the actual username and password.

## Scripts

### Run All Tests

Run all tests (both E2E and API) with:

```bash
npm run test
```

This command clears any existing Allure results and initiates the Playwright test runner.

### Run End-to-End Tests

Run the end-to-end tests in **headed mode**:

```bash
npm run run-e2e
```

This script runs the E2E tests located in the `src/tests/e2e` directory.

### Run API Tests

Run the API tests in **headless mode**:

```bash
npm run run-api
```

This script runs the API tests located in the `src/tests/api` directory.

### Generate and Open Allure Report

Generate and view the Allure report in your browser with:

```bash
npm run generate-and-open
```

This command generates the Allure report from the test results and automatically opens it in your default browser.
