FROM node:latest

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npx", "drizzle-kit", "generate", "&&", "npx", "drizzle-kit", "migrate"]
