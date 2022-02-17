# Ballerina in Action - A Full Stack Example

This example has 3 components:
1. Frontend - A React.js application protected using a separate identity provider
2. Identity Service - We have used an authorization server (Asgardeo.io) to authenticate users. We have used their react-sdk to implement SSO.
3. Backend - Contains a product service which validates the id_token obtained from Asgardeo before performing an operation.