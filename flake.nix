{
  description = "Simple Node.js development environment with .env support";

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
            if [ -f .env ]; then
              while IFS='=' read -r key value; do
                if [[ $key != '#'* && $key != '' ]]; then
                  echo "export $key=\"$value\""
                fi
              done < .env
            fi
          '';
          executable = true;
        };

      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
          ];
          shellHook = ''
            echo "Node.js version: $(node --version)"
            echo "Loading environment variables from .env file..."
            source <(${readEnvFile})
            echo "Environment variables loaded. You can now use them in your Node.js scripts."
          '';
        };
      }
    );
}
