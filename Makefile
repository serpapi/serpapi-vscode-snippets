all: scrape snippets

scrape:
	node scrape.js

snippets:
	ruby snippets.rb

install:
	npm install

gif:
	-rm doc/serpapi-snippsets-ruby-example.gif
	ffmpeg \
		-i doc/serpapi-snippsets-ruby-example.mov \
		-filter_complex "[0:v] fps=12,scale=720:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" \
		doc/serpapi-snippsets-ruby-example.gif 
#		 -loop 0 