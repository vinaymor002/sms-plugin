# Sms plugin      

## Installation

Clone and run `npm install`. 

## Update Configs
Update xola user details under user section. This user should have 'ROLE_SELLER_ADMIN' role.
Create a plivo account and update plivo account details.
Update other urls as per the local setup.
 
## Development

To start the server run `npm start` and server will be up at [localhost:3333](http://localhost:3333) by default.

## Config

legolas api is configured to `http://localhost:9000` and xola api is configured to `http://xola.local`. If you running them on any different endpoint or domain, modify `config.dev.js` for development environment

## Deployment
##### 1.update the following in payload/registration as per the environment
    a. user object
    b. webhookUrl
    c. link
##### 2. use the JSON payload(payload/plugin_registration) to register the plugin with legolas
##### 3. update the user credentials in .env file for secure environments.(.env is not checked into git). Content sample of .env
XOLA_USER_NAME=username@xola.local
XOLA_USER_PASSWORD=password
     
## API
### POST /messages
##### expected payload structure
`{
    "eventName": "conversation.message.create",
     "data": {
         "id": "57e3ca94a48cf28f048b4572",
         "from": "57e3c7c6a48cf290048b4569",
         "type": "sms",
         "body": "Hello, how are you",
         "recipient": {
             "phone": "+919999999999"
         },
         "conversation": {"id": "57e3ca91a48cf28f048b456c"},
         "seller": {"id": "57e3ca91a48cf28f048b456d"}
     }
 }`
 
### POST /messages/{id}/report
##### This end point is exposed to plivo as callback for message status update.