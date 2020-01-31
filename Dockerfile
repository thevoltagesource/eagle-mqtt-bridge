FROM node:8-alpine

WORKDIR /app
COPY *.js* ./
RUN npm ci

CMD [ "npm", "start" ]
