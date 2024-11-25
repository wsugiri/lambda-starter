# Lambda Starter

This project is a Node.js and Express starter template designed for serverless application development with AWS Lambda. It includes a clean project structure and optional support for a React.js client module.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/wsugiri/lambda-starter.git
cd lambda-starter
```

### 2. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 3. Set Environment Variables

Set up the environment variables required for the application. Follow these steps:

1. Copy the example `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in a text editor and update the values as needed. Example:   
   ```bash
   APP_PORT=9002
   ```
3. Save the file to apply the changes.



### 4. Start the Server
Start the application with the following command:
   ```bash
   npm start
   ```
The server will start, and you can access the application locally at `http://localhost:9002`.

## Project Structure
Here is an overview of the project directory structure:
```bash
lambda-starter/
├── client/                   # Optional client-side module using React.js
├── src/
│   ├── handlers/             # Lambda │   ├── routes/               # Define your API routes here
function handlers
│   ├── models/               # Database models (if applicable)
│   ├── utils/                # Utility functions
│   ├── views/                # Template views (if using templating engines)
│   ├── app.js                # Main Express app setup
│   ├── lambda.js             # Entry point for handling AWS Lambda requests
├── package.json              # Project metadata and dependencies
├── tests/                    # Unit and integration tests
├── .env                      # Environment variables (not included in repo)
└── README.md                 # Project documentation
```
