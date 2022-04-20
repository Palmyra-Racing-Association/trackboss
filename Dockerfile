FROM node:14

# Create app directory
WORKDIR /usr/src/app

# dependencies
COPY package*.json ./

RUN npm install
# or for prod
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "server" ]