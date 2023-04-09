# FYP

## Web (for testing)

To run the client:

```sh
cd booking-system/client
npm start
```

To run the server:

```sh
cd booking-system/server
npm run dev
```

## Web (for deployment)

To run the client:

```sh
cd booking-system/client
npm run build
serve -s build -l 2000
```

To run the server:

Remember to change all occurrences of `force` to `alter` in `server/seedDb.js`

```sh
cd booking-system/server
npm start
```

Docker
```sh
docker image ls
docker run [IMAGE]

# To get IP
docker ps
docker inspect [CONTAINER ID]
```

## Scripts

`scripts/package\_vio` contains the TCL script that student needs to add VIO core to their project.

`scripts/tcl_scripts` contains miscellaneous scripts used during testing for creating a virtual API.
