FROM node:20.5.0-alpine3.18

# set working directory in the image
WORKDIR /home/node/app

## copy over package
COPY package.json .

# npm install
COPY node_modules node_modules

## copy over src
COPY build build