FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /app

COPY .config .
RUN dotnet tool restore

COPY FactorioTech.sln .
COPY src/FactorioTech.Core/*.csproj src/FactorioTech.Core/
COPY src/FactorioTech.Api/*.csproj src/FactorioTech.Api/
COPY src/FactorioTech.Identity/*.csproj src/FactorioTech.Identity/
COPY test/FactorioTech.Tests/*.csproj test/FactorioTech.Tests/
RUN dotnet restore

COPY . .

ARG version="0.0.0-docker"
ARG build_branch=""
ARG build_sha=""
ARG build_uri=""

RUN echo "\
namespace FactorioTech.Core { \n\
    public class BuildInformation { \n\
        public const string Version = \"${version}\"; \n\
        public const string Branch = \"${build_branch}\"; \n\
        public const string Sha = \"${build_sha}\"; \n\
        public const string Uri = \"${build_uri}\"; \n\
    } \n\
}" > src/FactorioTech.Core/BuildInformation.cs \
 && cat /app/src/FactorioTech.Core/BuildInformation.cs

WORKDIR /app
RUN dotnet build --no-restore --configuration Release /p:DebugType=None \
 && dotnet publish src/FactorioTech.Api/FactorioTech.Api.csproj \
        --no-restore --no-build --configuration Release \
        --output /app/publish/api /p:DebugType=None \
 && dotnet publish src/FactorioTech.Identity/FactorioTech.Identity.csproj \
        --no-restore --no-build --configuration Release \
        --output /app/publish/identity /p:DebugType=None

ENTRYPOINT [ "dotnet" ]


FROM mcr.microsoft.com/dotnet/aspnet:7.0.0 as identity
ENV ASPNETCORE_URLS=http://*:8080
EXPOSE 8080
WORKDIR /app
COPY --from=build /app/publish/identity .
ENTRYPOINT [ "dotnet", "FactorioTech.Identity.dll" ]


FROM mcr.microsoft.com/dotnet/aspnet:7.0.0 as api
ENV ASPNETCORE_URLS=http://*:8080
EXPOSE 8080
WORKDIR /app
COPY --from=build /app/publish/api .
ENTRYPOINT [ "dotnet", "FactorioTech.Api.dll" ]
