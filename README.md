# FYP

## Vivado

1. Copy the scripts folder into a Vivado project folder
2. From the project folder, run init.tcl

## Web

To run the client (for testing):
```sh
cd booking-system/client
npm start
```

To run the server (for testing):
```sh
cd booking-system/server
npm run dev
```

Docker
```sh
docker image ls
docker run [IMAGE]

# To get IP
docker ps
docker inspect [CONTAINER ID]
```

TODO:

- FPGA/MCU pages require a check if there's a valid booking on access
