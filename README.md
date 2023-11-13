# Express TS Starter Using Controller->Service->Repository Architecture

## How to use?

```
$ npm install
$ npm run dev # run development!
```

## Scripts

```
$ npm run build # build typescript project
$ npm start # run in development mode
```

## Database

```
$ docker compose up -d # run database
$ docker compose down -v # delete database and the volume
```

# #How To make migrate
```
$ npx knex migrate:make users --migrations-directory ./src/databases/migrations -x ts
```
