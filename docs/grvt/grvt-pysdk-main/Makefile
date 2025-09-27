# A Self-Documenting Makefile: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sed -e 's/^Makefile://' | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: run
run: ## Run the project
	uv run python -m pysdk.main

.PHONY: test
test: ## Run the tests
	uv run pytest tests --cov=src

.PHONY: precommit
precommit: ## Run the pre-commit hooks
	bash .git/hooks/pre-commit

.PHONY: lint
lint: ## Run the linter
	uv run ruff check .

.PHONY: lint-fix
lint-fix: ## Run the linter and fix the issues
	uv run ruff check --fix --unsafe-fixes .

.PHONY: format
format: ## Run the formatter
	uv run ruff format .

.PHONY: typecheck
typecheck: ## Run the type checker
	uv run mypy .

.PHONY: security
security: ## Run the security checker
	uv run bandit .

.PHONY: clean
clean: ## Clean the project
	uv run ruff clean .

.PHONY: install
install: ## Install the project
	uv sync --all-extras --dev --frozen

.PHONY: build
build: ## Build the project
	uv build

.PHONY: publish
publish: ## Publish the project
	python3 build_readme.py
	make build
	uv run twine upload --skip-existing dist/*

# ==============================================================================
# always make sure the following is the last line on this file
.DEFAULT_GOAL := help
