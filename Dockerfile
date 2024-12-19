# Étape 1 : Build React
FROM node:18 AS build-stage

WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Construire le projet React pour la production
RUN npm run build

# Étape 2 : Utiliser Nginx pour servir l'application
FROM nginx:stable-alpine AS production-stage

# Copier le build dans le répertoire par défaut de Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
