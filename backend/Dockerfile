FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# إنشاء مجلدات الرفع
RUN mkdir -p uploads/announcements uploads/fees

EXPOSE 5000

CMD ["node", "server.js"]
