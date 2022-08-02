FROM node:16-bullseye

RUN apt-get update && \
    apt-get install -y g++ python3 python3-pip cmake
RUN pip3 install conan
RUN npm install -g npm@8.15.1

WORKDIR /opt/api
COPY package*.json ./
RUN npm ci
COPY . .

WORKDIR /opt/api/runner
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release

WORKDIR /opt/api/runner/build
RUN cmake --build . --config Release

WORKDIR /opt/api
RUN npm run build

EXPOSE 4000
ENTRYPOINT [ "npm", "run", "start:prod"]