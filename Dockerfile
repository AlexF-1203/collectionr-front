FROM node:18

WORKDIR /app

COPY package*.json ./

RUN ls -al

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
