.PHONY: prerender clean all

# Define source and destination directories
SOURCE_DIR := home
DEST_DIR := prerendered

EXCLUDE_FILES := toc.php changelog.php

# Find all files in the source directory
PHP_FILES := $(filter-out $(addprefix $(SOURCE_DIR)/, $(EXCLUDE_FILES)), $(wildcard $(SOURCE_DIR)/*.php))
OTHER_FILES := $(filter-out $(PHP_FILES) $(addprefix $(SOURCE_DIR)/, $(EXCLUDE_FILES)), $(wildcard $(SOURCE_DIR)/*))

# Define output HTML files
HTML_FILES := $(patsubst $(SOURCE_DIR)/%.php,$(DEST_DIR)/%.html,$(PHP_FILES))

# Default target
all: clean prerender

# Prerender target
prerender: $(HTML_FILES) $(patsubst $(SOURCE_DIR)/%,$(DEST_DIR)/%,$(OTHER_FILES))

# Rule for PHP files
$(DEST_DIR)/%.html: $(SOURCE_DIR)/%.php
	@mkdir -p $(DEST_DIR)
	@php $< | sed -E 's/href="([^"]+)\.php"/href="\1.html"/g' > $@
	@echo "Prerendered $< to $@"

# Rule for HTML files
$(DEST_DIR)/%.html: $(SOURCE_DIR)/%.html
	@mkdir -p $(DEST_DIR)
	@sed -E 's/href="([^"]+)\.php"/href="\1.html"/g' $< > $@
	@echo "Processed $< to $@"

# Rule for non-PHP files
$(DEST_DIR)/%: $(SOURCE_DIR)/%
	@mkdir -p $(DEST_DIR)
	@cp $< $@
	@echo "Moved $< to $@"

# Clean target
clean:
	@rm -rf $(DEST_DIR)
	@echo "Cleaned $(DEST_DIR) directory"