FROM node:18
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
ENV HOURS 1
ENV MINUTES 0
ENV SECONDS 0
ENV LIGHT_THRESHOLD 50
ENV API_URL http://0.0.0.0:8080

COPY . .

CMD [ "node", "index.js" ]
