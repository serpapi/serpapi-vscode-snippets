# Automate VSCode plugin for SerpApi
# 
all: scrape snippets

# create scrape.yml by scrape serpapi.com
scrape:
	node scrape.js

# create snippets from scrape.yml files
snippets:
	ruby snippets.rb

# install dependencies
#  node / npm must be installed
install:
	npm install
	npm install -g vsce

# TODO automate manually release flow
publish: 
	@echo "https://code.visualstudio.com/api/working-with-extensions/publishing-extension"

# command to convert mov to GIF
gif:
	-rm doc/serpapi-snippsets-ruby-example.gif
	ffmpeg \
		-i doc/serpapi-snippsets-ruby-example.mov \
		-filter_complex "[0:v] fps=12,scale=720:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" \
		doc/serpapi-snippsets-ruby-example.gif 
#		 -loop 0 