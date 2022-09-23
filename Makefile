all:
	rm *.zip | true
	zip file.zip *.css *.js *.html

.PHONY: install all
install:
	curl -LO https://github.com/processing/p5.js/releases/download/v1.4.2/p5.min.js --output p5.min.js