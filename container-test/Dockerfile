FROM node:alpine3.13
## it sets directory in the container to /app to store files and launch our app.
WORKDIR /app
## it copies the app to /app directory with dependencies.
COPY package*.json ./
RUN npm install
COPY . /app
## it commands to run our app which is index.js.
CMD node index.js
##  it exposes the port where our app is running that is port 8080.
EXPOSE 8080