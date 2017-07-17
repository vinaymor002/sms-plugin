# Sms plugin      

## Installation

Clone and run `npm install`. 

## Update Configs
Update xola user details under user section.
Update plivo account details.
Update other urls as per the local setup.
 
## Development

To start the server run `npm start` and server will be up at [localhost:3333](http://localhost:3333) by default.

## Config

legolas api is configured to `http://localhost:9000` and xola api is configured to `http://xola.local`. If you running them on any different endpoint or domain, modify `config.dev.js` for development environment

## Deployment
    1.update the following in payload/registration as per the environment
        a. user object
        b. webhookUrl
        c. link
    2. use the JSON payload to register the plugin with legolas
    