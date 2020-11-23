# factorio.tech

The one and only [Factorio](https://www.factorio.com) blueprints hub: https://factorio.tech

## Getting Started

    dotnet run --project src/FactorioTech.Web/FactorioTech.Web.csproj

### Run Tests

    dotnet test

## Factorio Game Data

The Factorio game data is expected to be present in a Docker volume called `factorio`.
You can download this data either using Steam or from the official website: https://www.factorio.com/download
(note that the headless version does **not** work, as it doesn't include all necessary assets!).

    docker volume create factorio
    docker run -v factorio:/data --name helper busybox true

    cd ~/Factorio_1.0.0
    docker cp . helper:/data
    docker rm helper