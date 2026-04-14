FROM gitea/gitea:1.21

# Lightweight Git hosting (Gitea) standing in for GitLab CE.
# Provides: repository browsing, API access, CI variables.
# Use docker-compose.lite.yml to swap GitLab CE for this.

ENV GITEA__server__ROOT_URL=http://gitlab.alpha.local:3000
ENV GITEA__server__HTTP_PORT=3000
ENV GITEA__database__DB_TYPE=sqlite3
ENV GITEA__service__DISABLE_REGISTRATION=false
ENV GITEA__security__INSTALL_LOCK=true

COPY setup/ /opt/setup/

EXPOSE 3000

# The standard Gitea entrypoint handles initialization.
# Post-start setup (repo creation, seeding) runs via the init script.
