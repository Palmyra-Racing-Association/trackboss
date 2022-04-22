FROM node:16
ENV PORT=3000
ENV MYSQL_DB=pradb

# Create app directory
WORKDIR /usr/src/app

# dependencies
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install
# or for prod
# RUN npm ci --only=production

EXPOSE ${PORT}
CMD [ "npm", "run", "server" ]