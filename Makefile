.PHONY: prerender clean all

# Define source and destination directories
SOURCE_DIR := home
DEST_DIR := prerendered

EXCLUDE_FILES := home/changelog.php home/login.php

# Find all files in the source directory
HTML_FILES := $(filter-out $(EXCLUDE_FILES), $(wildcard $(SOURCE_DIR)/*.html))
OTHER_FILES := $(filter-out $(HTML_FILES) $(EXCLUDE_FILES), $(wildcard $(SOURCE_DIR)/*))

# Define output HTML files
OUTPUT_FILES := $(patsubst $(SOURCE_DIR)/%,$(DEST_DIR)/%,$(HTML_FILES))

# Default target
all: clean prerender

# Prerender target
prerender: $(OUTPUT_FILES) $(patsubst $(SOURCE_DIR)/%,$(DEST_DIR)/%,$(OTHER_FILES))

# Rule for HTML files
$(DEST_DIR)/%.html: $(SOURCE_DIR)/%.html
	@mkdir -p $(DEST_DIR)
	@node toc.js $< $@

# Rule for non-PHP files
$(DEST_DIR)/%: $(SOURCE_DIR)/%
	@mkdir -p $(DEST_DIR)
	@cp $< $@
	@echo "Moved $< to $@"

# Clean target
clean:
	@rm -rf $(DEST_DIR)
	@echo "Cleaned $(DEST_DIR) directory"