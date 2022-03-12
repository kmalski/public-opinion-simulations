FROM node:14

WORKDIR /opt/client

RUN npm install -g npm@8.4.0

COPY package*.json ./

RUN npm ci

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]