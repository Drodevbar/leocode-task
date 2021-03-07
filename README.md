### Requirements
1. node (I was using _v12.18.3_)

### Running application locally
1. `cp .env.example .env`
1. _fill all environmental variables_
1. `npm install`
1. `npm run start`
1. _application is available on http://localhost:3000/_

### Running unit tests

1. `npm run test`

_Note: this is standard Nest.js app that was created from Nest.js boilerplate, so other Nest-specific npm scripts are also available (like linting, formatting, prod build, etc.) - see `package.json`_

### Buzzwords:
1. Nest.js along with TS 
1. jest for testing
1. Nest's HttpService (which uses axios) as http client

### Todos

Development of this application (implementing all the requirements and writing some unit tests)
took me something around 6h. I was informed that the usual time to complete this task 
is something around 4h, hence there are still some things to do that I would normally do, but because of time constrains I didn't.
These things are:
1. increase code coverage (right now only services are unit tested)
1. add e2e tests
1. Dockerize application
1. add CI/CI (running unit tests, e2e tests, linting)

### Available users

1. email: foo@leocode.com, password: secret1
1. email: bar@leocode.com, password: secret2

_Note: For simplicity’s sake and because
this project uses in-memory db, this application
stores passwords in plain text (normally I would use hashing function and store the hashes)_

### Api specification

#### 1. `POST /api/sign-in`

Endpoint for acquiring access token (jwt)

Payload (JSON)

```json
{
  "email": "foo@leocode.com",
  "password": "secret1"
}
```

Possible responses:

| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 201    | Password match. New JWT token returned | `authToken` - valid JWT        |
| 401    | Credentials don't match                                            | error containing all the details |
| 404    | User with given email not found                                            | error containing all the details |

---

_Note: next 2 endpoints require authorization - header: `Authorization: Bearer <jwt>`.
If header is not provided, is invalid or expired, `401` status code will be returned along with proper error message._

---

#### 2. `POST /api/generate-key-pair`

Endpoint for generating public and private RSA keys for logged-in user

Possible responses:

| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 201    | New public & private RSA keys created | object containing `privKey` and `pubKey` properties        |

---

#### 3. `POST /api/encrypt`

Endpoint for encrypting sample PDF file with user's RSA public key

Possible responses:

| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 201    | File encrypted successfully. Content returned in base64 format | `content` key - encrypted base64 sample pdf        |
| 400    | There is no public key generated for this user | error containing all the details along with `link` property directing user how to generate RSA key pairs        |

