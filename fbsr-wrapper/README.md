# FBSR Wrapper

This project is a [Spring Boot](https://spring.io/projects/spring-boot) wrapper around [Factorio-FBSR](https://github.com/demodude4u/Factorio-FBSR) that exposes a HTTP API for rendering blueprint images.

## Contributing

Since FBSR components are not published to a package repository, they are included as git submodules in the [deps](deps) folder. Make sure that the submodule contents are fully available:

```bash
git submodule update --init --recursive
```

You should then be able to build and package the project:

```bash
./build-local.sh
```

To allow running FBSR in Docker, a few patches/hacks have to be applied; see [build-local.sh](build-local.sh) and [Dockerfile](Dockerfile) for details.
