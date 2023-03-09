FROM node:18.12.1-alpine
RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app/
WORKDIR /usr/app/
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]
