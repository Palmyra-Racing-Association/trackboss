# clubmanager-2.0

## Setting Up the Server

In order for the server to function, it requires a .env file at the top level of the project. The file requires the following values at a minimum:

- COGNITO_POOL_ID
  - This variable is the pool ID of the Cognito user pool that the authentication subsystem will be using to authentiate
- COGNITO_CLIENT_ID
  - This variable is the client ID for the Cognito app that is registered for the user pool suppllied above