###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine As development

# Create node directory, where we will be store node_modules
WORKDIR /usr/src/node

# Install global nodemon for hot module replacement serve
RUN npm install -g nodemon

# Copy package.json
COPY dist/apps/server/auth-ms/package*.json ./

# Install deps
RUN npm install
# Implicit deps
RUN npm install pg

# Change directory to app
WORKDIR /usr/src/app

# Set path where we store node_modules
ENV NODE_PATH=../node/node_modules

# Copy source files
COPY dist/apps/server/auth-ms ./

# Start app via nodemon
CMD nodemon -L ./main.js

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3001
EXPOSE ${PORT}

COPY ./dist/apps/server/auth-ms .

RUN npm install --production
# Implicit deps
RUN npm install pg

CMD node ./main.js