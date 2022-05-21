FROM node:14 as build
WORKDIR /opt/ui
RUN npm install -g npm@8.4.0
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.20 as serve
COPY --from=build /opt/ui/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]