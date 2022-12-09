FROM nginx:latest
RUN mkdir /usr/share/nginx/html/ui/
COPY ui/ /usr/share/nginx/html/ui/
COPY manifest.json /usr/share/nginx/html/
COPY sw.js /usr/share/nginx/html/
COPY index.html /usr/share/nginx/html/