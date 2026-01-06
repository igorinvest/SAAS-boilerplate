### About
This is boilerplate project for SAAS. Originally created for https://docion.com - corporate wiki with advanced versioning system.

### Boilerplate includes:
1. uWebsocket.js server (NodeJS)
2. Postgres database (via Sequelize, can be easily replaced with anything else)
3. Angular 21 client (with Tailwind)

### Features
1. Email/Google auth (both passwordless) with JWT
2. Spaces/Organisations with basic user management
3. Projects/Folders for your entities
4. Basic ui components (no dependencies)

### System/User requirements
- Angular and NodeJS knowledge
- NodeJS
- Postgres
- Email gateway for self-registration or GOOGLE_CLIENT_ID for google auth
- Angular CLI

### Installation
0. Clone/download project
1. Create .env file in ./server  
```env
# General
EMAIL_TYPE="SMTP"#options: SMTP, CONSOLE
DB_TYPE="LOCAL"#options: LOCAL
HTTP_PORT="5001"
CLIENT_URL="http://localhost:4200"
API_URL="http://localhost:5001/api"
# SMTP
SMTP_HOST="smtp.googlemail.com"
SMTP_PORT=587
SMTP_USER="user"
SMTP_PASSWORD="password"
# Local database
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="DB_NAME"
DB_USER="DB_USER"
DB_PASSWORD=""
# JWT
JWT_ACCESS_SECRET="aaaa"
JWT_REFRESH_SECRET="bbb"
GOOGLE_CLIENT_ID=""#for google auth
MODEL_SYNC="new"#'none', 'new', 'alter'
USE_SSL="false"
```
During first launch use MODEL_SYNC="new" so that system creates DB schema automatically

2. Go to ./server folder and run npm i  
3. Launch node index.js (on production you need to build ui first - server will only serve existing files by default)  
4. Go to ./ui and run npm i  
5. Run ng generate environments - this will create ui/src/environments/environment.ts file  
6. Add angular configs in environment files:  
apiUrl: 'http://localhost:5001/api',  
googleClientId: '' - for google auth support, same as GOOGLE_CLIENT_ID  
7. Start UI with ng serve or ng build (ng build is expected for production)  
Use docker if needed  
Project may contain unused files and commented code  