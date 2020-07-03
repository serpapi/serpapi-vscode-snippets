all: scrape snippets

scrape:
	node scrape.js

snippets:
	ruby snippets.rb

install:
	npm install