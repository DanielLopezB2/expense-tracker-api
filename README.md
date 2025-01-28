<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Expense Tracker API - Daniel Lopez

* Project idea by: https://roadmap.sh/projects/expense-tracker-api

## Tech Stack

* PostgreSQL
* NestJs

## Project setup
1. Clone project
```
https://github.com/DanielLopezB2/expense-tracker-api.git
```

2. Install packages
```bash
$ npm install
```

3. Clone .env.template and rename it to .env

4. Change the .env variables

5. Set Database
```bash
$ docker-compose up -d
```

6. Start server in dev mode
```bash
$ npm run start:dev
```

7. Execute seed
```bash
$ http://localhost:3000/api/seed
```

## API Usage

### Auth

#### - Register
##### Method: POST

```
http://localhost:3000/api/v1/users/register
```


* Send in the request body:
```
{
  "name": "Example",
  "email": "example@example.com",
  "password": "Abc123"
}
```

#### - Login
##### Method: POST

```
http://localhost:3000/api/v1/auth/login
```

* Send in the request body:
```
{
  "email": "example@example.com",
  "password": "Abc123"
}
```

#### - Logout
##### Method: GET

```
http://localhost:3000/api/v1/auth/logout
```

* Send the Authorization header with Bearer Token

### Seed

#### - Populate the Database with default Categories
##### Method: POST

```
http://localhost:3000/api/v1/seed
```

* Send the Authorization header with Bearer Token

### Categories

#### - List All Categories
##### Method: GET

```
http://localhost:3000/api/v1/categories
```

* Send the Authorization header with Bearer Token

#### - Create a new category
##### Method: POST

```
http://localhost:3000/api/v1/categories
```

* Send the Authorization header with Bearer Token
* Send in the request body:

```
{
  "name": "Example"
}
```

#### - Update a category
##### Method: PATCH

```
http://localhost:3000/api/v1/categories/27a94d00-09b3-41a9-98f3-46c7bbd42fae
```

* Send the Authorization header with Bearer Token
* Send in the request body:

```
{
  "name": "Example Updated!"
}
```

#### - Delete a category
##### Method: DELETE

```
http://localhost:3000/api/v1/categories/27a94d00-09b3-41a9-98f3-46c7bbd42fae
```

* Send the Authorization header with Bearer Token

### Expenses

#### - List All Expenses
##### Method: GET

```
http://localhost:3000/api/v1/expenses
```

* Send the Authorization header with Bearer Token
* Query param to filter
```
http://localhost:3000/api/v1/expenses?filter=last_week
```
* Values accepted for filter param:
```
last_week
last_month
last_3_months
2025-01-01_2025-01-12 (Exactly in this format to indicate a custom range)
```

#### - Create a new expense
##### Method: POST

```
http://localhost:3000/api/v1/expenses
```

* Send the Authorization header with Bearer Token
* Send in the request body:

```
{
  "name": "Pay Check",
  "amount": 29900,
  "category": "others"
}
```

#### - Update an expense
##### Method: PATCH

```
http://localhost:3000/api/v1/expenses/27a94d00-09b3-41a9-98f3-46c7bbd42fae
```

* Send the Authorization header with Bearer Token
* Send in the request body:

```
{
  "name": "Updating an expense",
  "category": "groceries"
}
```

#### - Delete an expense
##### Method: DELETE

```
http://localhost:3000/api/v1/expenses/27a94d00-09b3-41a9-98f3-46c7bbd42fae
```

* Send the Authorization header with Bearer Token
