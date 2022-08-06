# Testing account

Email: test@test.com

Password: qwerty78!

# Fullstack Nest.js and Angular MFE application

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

-   [React](https://reactjs.org)
    -   `npm install --save-dev @nrwl/react`
-   Web (no framework frontends)
    -   `npm install --save-dev @nrwl/web`
-   [Angular](https://angular.io)
    -   `npm install --save-dev @nrwl/angular`
-   [Nest](https://nestjs.com)
    -   `npm install --save-dev @nrwl/nest`
-   [Express](https://expressjs.com)
    -   `npm install --save-dev @nrwl/express`
-   [Node](https://nodejs.org)
    -   `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Notice

**In production build MFE will be don`t work correctly, because MfeOutletDirective create component dynamically.**

The production build runs an optimizer that strips the needed information.
You could turn off AOT (check the angular.json configuration) and in this case the module and components will be compiled and runtime.
But still, when built for production, the names of the components will be minified.

## Generate an MFE application

**This project has custom nx generator to automate the creation of MFE applications.**

Run `nx workspace-generator mfe my-mfe` to generate an MFE application.

> You can select that type of MFE you want to create - host or remote

## Generate an application

Run `nx g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@nx-mfe/my-lib`.

## Development host app

Run `nx serve client-shell-app` for a dev host app. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Development MFE app

Run `nx serve client-auth-mfe` for a dev MFE. Navigate to http://localhost and the port specified in workspace.json or angular.json. The app will automatically reload if you change any of the source files.

## Development server

Run `nx serve server` for a dev server. Navigate to http://localhost:3000/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/angular:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
