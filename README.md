# Market manager
> Market Manager is a web application designed to assist various types of markets, including stores, shops, and other retail establishments. It addresses challenges like inventory, sales tracking, and employee control. It also offers features for business and financial analytics.

## Developers
- Fullstack
	- Pedro Henrique, [Github](https://github.com/phbrg)

## Technologies
- Backend
	- Node.js | Express.js | Sequelize.js | PostgreSQL | JavaScript
- Frontend
	- React.js | JavaScript

> Other packages were used in the project, you can check each packages on: [Backend packages](https://github.com/phbrg/market-manager/blob/main/backend/package.json), [Frontend packages](https://github.com/phbrg/market-manager/blob/main/frontend/package.json)

## Docs
### Backend

### How to run the api

To run the backend api you need:
- Node.js
- PostgreSQL
- Git or Yarn

First you need to clone the project using:

<code> git clone https://github.com/phbrg/market-manager.git </code>

After clone run:

<code> npm i </code>

to install the dependencies

Then create and <code>.env</code> archive in the project root folder and add these variables:
```JSON
POSTGRES_HOST=localhost # your host
POSTGRES_DATABASE= # your database name
POSTGRES_USER= # your postgres user
POSTGRES_PASSWORD= # your postgres password
SYSTEM_PASSWORD=admin # project admin password
JWT_KEY= # project jwt secret key
```
> You need to create an database on pgAdmin with the name of POSTGRES_DATABASE

Then you can run

<code> npm start </code>

After all the app should run, if not you can contact me.

### API Functions

### Normal user

#### Register product
- Route: <code>/registerproduct</code>
- Method: <code>POST</code>
- Body:
```JSON
{
	"name":  "product",
	"price":  99.99,
	"amount":  99,
	"expiration":  "2024-01-01"
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "Product successfully created.",
		"product":  {
			"id":  1,
			"name":  "product",
			"price":  99.99,
			"amount":  99,
			"expiration":  "2024-01-01T00:00:00.000Z",
			"updatedAt":  "2024-01-01T00:00:00.000Z",
			"createdAt":  "2024-01-01T00:00:00.000Z"
		}
	}
	```
	
#### Get products
- Route: <code>/products/parameter1/parameter2</code>
	- parameters:
	- <code>/</code>: get all products.
	- <code>in-stock</code>: get all in stock products.
	- <code>out-of-stock</code>: get all unavaliable products.
	- <code>name/name</code>: get the product by name.
	- <code>expired</code>: get all expired products.
	- <code>unexpired</code>: get all unexpired products.
- Method: <code>GET</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  [
			{
				"id":  1,
				"name":  "product",
				"price":  99.99,
				"amount":  99,
				"expiration":  "2024-01-01T00:00:00.000Z",
				"createdAt":  "2024-01-01T00:00:00.000Z",
				"updatedAt":  "2024-01-01T00:00:00.000Z"
			}
		]
		...
	}
	```

#### Update product
- Route: <code>/editproduct/id</code>
- Method: <code>PUT</code>
- Body:
```JSON
{
	"name":  "product",
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "Product successfully updated."
	}
	```

#### Delete product
- Route: <code>/deleteproduct/id</code>
- Method: <code>DELETE</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "Product successfully deleted."
	}
	```

#### Register sale
- Route: <code>/registersale</code>
- Method: <code>POST</code>
- Body:
```JSON
{
	"products":  [
		{
			"id":  1,
			"amount":  99
		},
		...
	]
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "Sale successfully registered.",
		"sale":  {
			"id":  1,
			"products":  [
				{
					"id":  1,
					"amount":  99
				}
			],
			"UserId":  1,
			"updatedAt":  "2024-01-01T00:00:00.000Z",
			"createdAt":  "2024-01-01T00:00:00.000Z"
		}
	}
	```

#### Update sale
- Route: <code>/editsale/id</code>
- Method: <code>PUT</code>
- Body:
```JSON
{
	"products":  [
		{
			"id": 99,
			"amount": 99
		},
		...
	]
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "Sale successfully updated."
	}
	```

#### Delete sale
- Route: <code>/deletesale/id</code>
- Method: <code>DELETE</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "Sale successfully deleted."
	}
	```

#### Get sales
- Route: <code>/sales/parameter1/parameter2</code>
	- parameters:
	- <code>/</code>: get all sales.
	- <code>total</code>: get sale by total.
	- <code>date</code>: get sale by date.
- Method: <code>GET</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
    "message": "Sale successfully registered.",
    "sale": {
        "id": 1,
        "products": [
            {
                "id": 99,
                "amount": 99
            },
						...
        ],
        "total": 999.9,
        "UserId": 1,
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
    }
	}
	```

#### Login
- Route: <code>/login</code>
- Method: <code>POST</code>
- Body:
```JSON
{
	"login": "login",
	"password": "password"
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "You are successfully authenticated."
	}
	```

### Admin user

#### Register user
- Route: <code>/admin/registeruser</code>
- Method: <code>POST</code>
- Body:
```JSON
{
	"name":  "name",
	"login":  "login",
	"password":  "password",
	"confirmPassword":  "password",
	"adminPassword":  "admin"
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "User successfully registered."
	}
	```

#### Get users
- Route: <code>/users/parameter1/parameter2</code>
	- parameters:
	- <code>/</code>: get all users.
	- <code>employee</code>: get all users with employee role.
	- <code>name/name</code>: get the user by name.
	- <code>login/login</code>: get the user by login.
- Method: <code>GET</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  [
			{
				"id":  1,
				"name":  "name",
				"login":  "login",
				"role":  "ROLE",
				"createdAt":  "2024-01-01T00:00:00.000Z",
				"updatedAt":  "2024-01-01T00:00:00.000Z"
			},
			...
		]
	}
	```

#### Edit user
- Route: <code>/admin/edituser/id</code>
- Method: <code>PUT</code>
- Body:
```JSON
{
	"name":  "name",
}
```
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "User successfully updated."
	}
	```

#### Delete user
- Route: <code>/admin/deleteuser/id</code>
- Method: <code>DELETE</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  "User successfully deleted."
	}
	```

#### Get logs
- Route: <code>/admin/logs/parameter1/parameter2</code>
	- parameters:
	- <code>/</code>: get all products.
	- <code>create</code>: get all logs with CREATE category.
	- <code>update</code>: get all logs with UPDATE category.
	- <code>delete</code>: get all logs with DELETE category.
	- <code>userid/id</code>: get logs by user id.
- Method: <code>GET</code>
- Response:
	- Status: <code>200</code>
	```JSON
	{
		"message":  [
			{
				"id":  1,
				"message":  "New user registered in the database. [Username: admin, Login: admin]",
				"category":  "CREATE",
				"createdAt":  "2024-01-01T00:00:00.000Z",
				"updatedAt":  "2024-01-01T00:00:00.000Z",
				"UserId":  1
			},
			...
		]
	}
	```
	
## License
This project is under [MIT License](LICENSE). See [LICENSE](LICENSE)   
for more details.
