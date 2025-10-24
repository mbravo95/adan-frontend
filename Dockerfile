# Version liviana de Node.js
FROM node:25-alpine3.21
 
# Setear el directorio de trabajo dentro del contenedor
WORKDIR /app
 
# Copiando los archivos package.json y package-lock.json
COPY package*.json ./
 
# Instalar dependencias
RUN npm install

# Copiando el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 5173

# Definir el comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]