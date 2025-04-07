# Usando a imagem do Node.js
FROM node:14

# Definindo o diretório de trabalho
WORKDIR /usr/src/app

# Copiando o package.json e instalando as dependências
COPY package*.json ./
RUN npm install

# Copiando o restante do código
COPY . .

# Expondo a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "src/app.js"]