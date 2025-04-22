FROM node:23-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.json ./
RUN chown node:node -R ./
USER node
RUN npm install
COPY --chown=node:node ./src .

EXPOSE 5000

CMD [ "npm", "run", "container-start" ]
