###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies using the `npm install`
RUN npm install

# Bundle app source
COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine As build

WORKDIR /usr/src/app

# In order to run `npm run build` we need access to the Nx CLI.
# The Nx CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

# Set NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Run the build command which creates the production bundle
RUN npx nx build server-mail-ms

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/src/app

ENV PORT=3003
EXPOSE ${PORT}

# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/dist/apps/server/mail-ms .

RUN npm install --production

# Start the server using the production build
CMD node ./main.js

###################
# PRODUCTION FROM NX
###################

FROM node:16-alpine As production-nx

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3003
EXPOSE ${PORT}

COPY ./dist/apps/server/mail-ms .

RUN npm install --production

CMD node ./main.js