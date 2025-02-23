FROM node:22.14-slim

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host" ]
