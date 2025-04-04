FROM node:22.14.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY /nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/ta-web/browser /usr/share/nginx/html

EXPOSE 80