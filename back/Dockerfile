FROM node:20-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости (включая devDependencies, т.к. у вас нет отдельного prod-скрипта)
RUN npm install

# Копируем весь исходный код
COPY . .

# Пробрасываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "app.js"]