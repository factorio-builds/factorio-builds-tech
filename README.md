# factorio.tech

A [Factorio](https://www.factorio.com) blueprints hub. Currently in **public beta**: https://beta.factorio.tech

## Getting Started

    docker-compose up --detach --build

or

    dotnet run --project src/FactorioTech.Web/FactorioTech.Web.csproj

## Contributing

### Factorio Game Data

The Factorio game data is expected to be present in a Docker volume called `factorio`.
You can download this data either using Steam or from the official website: https://www.factorio.com/download
(note that the headless version does **not** work, as it doesn't include all necessary assets!).

    docker volume create factorio
    docker run -v factorio:/data --name helper busybox true

    cd ~/Factorio_1.0.0
    docker cp . helper:/data
    docker rm helper

### Run Tests

    dotnet test

### Create a migration

     dotnet ef migrations add "xxx" -o Data/Migrations -p src/FactorioTech.Core/FactorioTech.Core.csproj

### Apply migrations

    dotnet ef database update -p src/FactorioTech.Core/FactorioTech.Core.csproj
