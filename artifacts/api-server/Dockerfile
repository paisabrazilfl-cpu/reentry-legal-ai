FROM node:24-slim

WORKDIR /app

COPY dist ./dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
