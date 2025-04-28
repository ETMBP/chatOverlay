FROM node:23-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.prod.json ./
RUN chown node:node -R ./
USER node
RUN npm install
RUN mkdir ./src
COPY --chown=node:node ./src ./src
RUN npm run build:prod

EXPOSE 5000

CMD [ "npm", "run", "start:prod" ]
