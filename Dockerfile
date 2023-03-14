FROM node:18.12.1-alpine
WORKDIR /usr/app/
COPY package*.json ./
USER node
RUN npm ci
COPY --chown=node:node . .
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]
