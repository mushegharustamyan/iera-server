FROM node:latest

WORKDIR /iera-server
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run","start"]
