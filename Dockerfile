FROM node:18.12.1-alpine
WORKDIR /usr/app/
COPY package*.json ./
RUN npm ci
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]
