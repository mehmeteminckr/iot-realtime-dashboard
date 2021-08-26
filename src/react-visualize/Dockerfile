FROM node:14-alpine as build

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

RUN npm run build

FROM node:14-alpine

WORKDIR /usr/app/
COPY package*.json ./
RUN npm install --production
COPY --from=build /usr/app/build ./build
RUN npm install -g serve

CMD serve -s build -l 3000