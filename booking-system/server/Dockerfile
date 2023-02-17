# syntax=docker/dockerfile:1
   
FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "npm", "run" ]
