FROM postgres:15-alpine

COPY init/ /docker-entrypoint-initdb.d/

ENV POSTGRES_DB=protected
ENV POSTGRES_USER=alpha_admin
ENV POSTGRES_PASSWORD=Alph4_DA_2026!

EXPOSE 5432
