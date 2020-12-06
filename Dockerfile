FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && echo "node version: $(node --version)" \
 && echo "npm version: $(npm --version)" \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app/src/FactorioTech.Web
COPY src/FactorioTech.Web/package*.json ./
COPY src/FactorioTech.Web/gulpfile.js .

RUN npm install --include=dev

# patch broken imports in selectize module
RUN sed -i '/@import "..\/..\/node_modules\/bootstrap4/d' \
    node_modules/selectize/src/scss/selectize.bootstrap4.scss

WORKDIR /app
COPY FactorioTech.sln .
COPY src/FactorioTech.Core/*.csproj src/FactorioTech.Core/
COPY src/FactorioTech.Web/*.csproj src/FactorioTech.Web/
COPY test/FactorioTech.Tests/*.csproj test/FactorioTech.Tests/

RUN dotnet restore

COPY . .

ARG version=""
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

WORKDIR /app/src/FactorioTech.Web
RUN dotnet publish -c Release -o /app/publish --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:5.0
EXPOSE 80 443

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FactorioTech.Web.dll"]
