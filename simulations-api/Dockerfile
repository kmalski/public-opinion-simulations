FROM node:14
WORKDIR /opt/api
RUN npm install -g npm@8.4.0
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
ENTRYPOINT [ "npm", "run", "start:prod"]