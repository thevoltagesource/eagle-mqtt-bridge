FROM node:12-alpine

WORKDIR /app
COPY *.js* ./
RUN npm ci

CMD [ "npm", "start" ]
