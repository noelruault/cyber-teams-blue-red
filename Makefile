#!/usr/bin/make -f

.ONESHELL:
.SHELL := /usr/bin/bash

AUTHOR := "noelruault"
PROJECTNAME := $(shell basename "$$(pwd)")
PROJECTPATH := $(shell pwd)

# Global variable for package manager (defaulting to "bun")
PACKAGE_MANAGER ?= bun
# Global variable for main JS file
MAIN_SERVER_JS_FILE := src/backend/index.js
MAIN_UI_JS_FILE := src/frontend/index.js

FLAGS ?=

# Function: require_command
# Description: This function checks if a specified command is installed on the system. If the command is not found, it displays an error message provided by the user and exits with a non-zero status code.
# Parameters:
#	- $1 (string): The name of the command to check for.
#	- $2 (string): The error message to display if the specified command is not found.
# Usage: require_command <command_name> <error_message>
# Example:
#	To ensure that 'wget' command is installed and display a custom error message if it's not found, you can use:
#	 $(call require_command, wget, "wget is required to download files.")
#	This will check if 'wget' is installed, and if not, it will display the provided error message and exit with a non-zero status code.
#
define require_command
	@if ! command -v $(1) &> /dev/null; then\
		echo "$(1) not found. $(2)";\
		exit 1;\
	fi
endef

# $(1) = file path
# $(2) = version pattern to match and replace
#
# alternative increment_version function
# sed -i '' "s/$(2)\"$$current_version\"/$(2)\"$$new_version\"/" $(1);
# $(call increment_version,$(MAIN_SERVER_JS_FILE),const SERVER_VERSION = )
define increment_version
	@if ! grep -q '$(2)' $(1); then \
		echo "Error: Version pattern not found in $(1)"; \
		exit 1; \
	fi; \
	current_version=$$(grep '$(2)' $(1) | sed -E 's/.*[^0-9]([0-9]+\.[0-9]+\.[0-9]+).*/\1/'); \
	major=$$(echo $$current_version | cut -d. -f1); \
	minor=$$(echo $$current_version | cut -d. -f2); \
	patch=$$(echo $$current_version | cut -d. -f3); \
	new_patch=$$((patch + 1)); \
	new_version="$$major.$$minor.$$new_patch"; \
	sed -i '' "s/$(2)$$current_version/$(2)$$new_version/" $(1); \
	echo "✓ Updated version from $$current_version to $$new_version in $(1)"
endef

# Function: install_command
# Description: This function checks if a specified command is installed on the system. If the command is not found, it installs it using a provided installation command.
# Parameters:
#	- $1 (string): The name of the command to check for.
#	- $2 (string): The command to execute for installation if the specified command is not found.
# Usage: install_command <command_name> <installation_command>
# Example:
#	To ensure that 'wget' command is installed, you can use:
#	 $(call install_command, wget, sudo apt-get install wget)
#	This will check if 'wget' is installed, and if not, it will execute 'sudo apt-get install wget' to install it.
#
define install_command
	@if ! command -v $(1) &> /dev/null; then\
		echo "$(1) not found, installing...";\
		$(2);\
	fi
endef

# Extract help text for a given make target
define get_help_text
$(shell # ⚠️ DO NOT ADD A TAB BEFORE shell, will add spaces to the output)
$(shell grep -E '^$(1):.*?##' Makefile | awk -F '##' '{print $$2}' | sed 's/^[[:space:]]*//g')
endef

define check_defined
	$(if $(strip $($(1))),,$(error 🚫 $(3) error: $(2) is not set. $(call get_help_text,$(3))))
endef


define get_target_help
	$(shell awk '/## / && $$0 ~ "$(1)" { sub(/^.*## /,""); print }' $(MAKEFILE_LIST) | head -n1)
endef

help:
	@echo "Usage: make [options] [arguments]\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## Clean dist folders throughout the project
	find . -type d -name 'dist' -exec rm -rf {} +
	@if echo "$(FLAGS)" | grep -q 'a'; then \
		rm -rf node_modules; \
	fi

update: ## Update dependencies of development environment
	$(PACKAGE_MANAGER) update --latest


init: ## Ensure initialization is possible in the development environment
	$(call require_command, $(PACKAGE_MANAGER), "Configure NodeJS and '$(PACKAGE_MANAGER)' before running this program.")
	$(call require_command, gum, "Install Gum from charmbracelet before running the Makefile.")

deps: init ## Setup project for development
	$(call install_command, eslint, $(PACKAGE_MANAGER) install --save-dev eslint @eslint/js)
	$(call install_command, $(PACKAGE_MANAGER) vite, $(PACKAGE_MANAGER) install --save-dev vite@latest )
	$(PACKAGE_MANAGER) install --verbose

	# After setup, you can run ESLint on a specific file by running '<package_manager> run eslint <file.js>'
	@echo "✔️ Project setup complete."

serve-frontend: ## Start frontend live server
	$(PACKAGE_MANAGER) vite --port 8000 --strictPort

serve-backend: ## Start backend live server
	$(PACKAGE_MANAGER) --hot --port=3000 run $(MAIN_SERVER_JS_FILE)

serve-fileserver: ## Start backend live server
	cd src/file-server && $(PACKAGE_MANAGER) --hot run index.js

check-component:
	$(eval COMPONENT := $(shell gum choose --header "In which component?" "frontend" "backend" "fileserver"))
	@echo "ℹ️ Selected $(COMPONENT) component"

serve: check-component ## Serve the selected component
	@if [ "$(COMPONENT)" = "frontend" ]; then \
		make serve-frontend; \
	elif [ "$(COMPONENT)" = "backend" ]; then \
		make serve-backend; \
	elif [ "$(COMPONENT)" = "fileserver" ]; then \
		make serve-fileserver; \
	fi

test: check-component
	@echo "Testing value propagation: $(COMPONENT)..."

docker-up: ## Start the Docker containers for development (with live code updates)
	docker compose up --build --force-recreate
