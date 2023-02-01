FROM node:16-slim

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000
EXPOSE ${PORT}

COPY ./dist/apps/server/api-gateway .

RUN npm install --production

CMD node ./main.js