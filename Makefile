all: style

style:
	$(shell npm bin)/stylus --compress --out stylus/compiled --include node_modules/nib/lib stylus
	rm -f public/stylesheets/style.css
	cat stylus/compiled/* >> public/stylesheets/style.css
	cp bower_components/jquery/jquery.min.js public/javascripts/jquery-min.js

install:
	mkdir -p stylus/compiled
	mkdir -p public/stylesheets
	mkdir -p public/javascripts
	npm install
	$(shell npm bin)/bower install
