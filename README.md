# Overview

# Getting Started

Before first launch, ensure that you have received all necessary files and credentials from [Reece](mailto:reece@tunehatch.com).

Requirements:
* Node.js v18.12.1(LTS)
* ArangoDB Credentials
* .env.development File Template
* Iris SSL Certificate Installed

If you are missing any of these requirements, please contact Reece or check the Developer Onboarding Guide.

## For MacOS Users
To allow Canvas to be installed, the following command should be run before `npm install`.\
`brew install pkg-config cairo pango libpng jpeg giflib librsvg`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## `npm run server`
This launches a server on localhost to access and test API changes.\
This is 100% necessary if you are building changes to the backend.\
If you are only building on the frontend, you might be able to rely on Iris. Configure your .env file accordingly.

### `npm run build`

Builds the app. This should be used for testing before shipping a feature.
