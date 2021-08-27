# start with a nodejs base-image
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --production

# Bundle app source
COPY . .


RUN npm run build

#set start command for container
CMD [ "npm", "run","start" ]
