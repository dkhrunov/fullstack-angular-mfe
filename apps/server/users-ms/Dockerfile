FROM node:16-slim

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3002
EXPOSE ${PORT}

COPY ./dist/apps/server/users-ms .

RUN npm install --production
# Implicit deps
RUN npm install pg

CMD node ./main.js