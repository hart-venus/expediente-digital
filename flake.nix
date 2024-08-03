{
  description = "Next.js project flake with .env support";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Function to read .env file
        readEnvFile = pkgs.writeTextFile {
          name = "read-env-file";
          text = ''
            #!/usr/bin/env bash
            set -euo pipefail
            while IFS='=' read -r key value; do
              if [[ $key != '#'* && $key != '' ]]; then
                echo "export $key=\"$value\""
              fi
            done < "$1"
          '';
          executable = true;
        };

      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            yarn
          ];
          shellHook = ''
            if [ -f .env ]; then
              source <(${readEnvFile} .env)
            fi
          '';
        };

        packages.default = pkgs.mkYarnPackage {
          name = "nextjs-project";
          src = ./.;
          packageJSON = ./package.json;
          yarnLock = ./yarn.lock;
          buildPhase = ''
            export HOME=$(mktemp -d)
            if [ -f .env ]; then
              source <(${readEnvFile} .env)
            fi
            yarn build
          '';
          installPhase = ''
            mkdir -p $out
            cp -r .next $out/
            cp -r public $out/
            cp package.json $out/
            if [ -f .env ]; then
              cp .env $out/
            fi
          '';
        };

        apps.default = flake-utils.lib.mkApp {
          drv = pkgs.writeShellScriptBin "start-nextjs" ''
            if [ -f ${self.packages.${system}.default}/.env ]; then
              source <(${readEnvFile} ${self.packages.${system}.default}/.env)
            fi
            ${pkgs.nodejs}/bin/node ${self.packages.${system}.default}/server.js
          '';
        };
      }
    );
}
