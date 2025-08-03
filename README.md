## 📚 Digital Wallet System
A secure and modular role-based backend API for a digital wallet system (like Bkash or Nagad) built with Express.js and Mongoose. It supports user registration, wallet management, and core financial operations including add money, withdraw, and send money.


### 🚀 Features

#### 👥 User Management
- implemented Add money by agent (cash-in) (top-up)
- Withdraw money by agent (chash-out).
- Send money to another user.
- View transaction history.
- Agent status will active/suspend by admin.
- Users Will make them active/inactive/blocked.

#### 💰 Wallet Management
- Auto Wallet creation, when user create.
- Wallet will blocked/unbloced by admin.
- auto fee add in admin wallet when user send money to another user.
- auto commission add in agents wallet and fee add in admin wallet when cashout.

#### 💳 Transaction Management 
- all transaction will store at transaction model
- admin can access all transaction
- user and agents can access their all transaction 

#### Authentication/Authorization Management 
- login by setup jwt access and refresh token at cookies
- seeding admin creation
- reset-password
- refresh-token
- authorization done by setup check auth middleware
- logout by clearing cookies

Here's your backend tech stack section written in the same format:

---

#### 🧰 Tech Stack

- Express.js v5
- Mongoose v8
- TypeScript
- Zod for schema validation
- JSON Web Token (JWT) for authentication
- Bcrypt.js for password hashing
- Cookie-Parser for handling cookies
- CORS for cross-origin requests
- Dotenv for environment variables
- HTTP Status Codes for clean status management


#### 💻 setup
- clone this repository on you local device
```
git clone "repository link"
```
- go to that project folder
```
cd "file name"
```
- run this command to install node_modules
```
npm install
```

- setup .env file at the root folder
```
DB_URL=mongodb_url
PORT=port_number
NODE_ENV=development

# Bcrypt
BCRYPT_SALT_ROUND=10

# Seed Admin
ADMIN_PHONE=any_phone_no.
ADMIN_PASSWORD=password

# JSON Web Token
JWT_ACCESS_SECRET=secrete_key
JWT_ACCESS_EXPIRES=1d

JWT_REFRESH_SECRET=secrete_key
JWT_REFRESH_EXPIRES=30d

# Minimum Balance
MINIMUM_BALANCE=minimum_amount
CHARGE_LIMIT=example_limit
PERCENTAGE_LIMIT=example_percentage
```

- run this command to run the project in you local machine
```
npm run dev
```