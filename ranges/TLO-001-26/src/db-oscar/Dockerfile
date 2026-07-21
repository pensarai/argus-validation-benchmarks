FROM postgres:15-alpine

COPY init/ /docker-entrypoint-initdb.d/

ENV POSTGRES_DB=oscar
ENV POSTGRES_USER=oscar_app
ENV POSTGRES_PASSWORD=oscar_db_pass

EXPOSE 5432
