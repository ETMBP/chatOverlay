FROM node:23-alpine AS build

RUN mkdir -p /app

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN mkdir src public
COPY ./src src/
COPY ./public public/
RUN npm run build

FROM nginx:stable-alpine AS production
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]