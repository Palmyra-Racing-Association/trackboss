# clubmanager-2.0

## Setting Up the Server

In order for the server to function, it requires a `.env` file at the top level of the project. The file requires the following values at a minimum:

- `COGNITO_POOL_ID`
  - This variable is the pool ID of the Cognito user pool that the authentication subsystem will be using to authenticate
- `COGNITO_CLIENT_ID`
  - This variable is the client ID for the Cognito app that is registered for the user pool supplied above
- `MYSQL_DB`
  - This variable is the name of the database the server will be interacting with
  - For development, we've been using `pradb`
- `MYSQL_HOST`
  - This variable is the name of the database's host
  - For development, we've been using `localhost`
- `MYSQL_USER`
  - This variable is the name of the user to interact with the database
  - For development, we've been using `dev`
- `MYSQL_PASS`
  - This variable is the password of the user to interact with the database
  - For development, we've been using `devpass`

`PORT` can also be included in the file, but defaults to `8080` if not present.