style:
	stylus --compress --out stylus/compiled --include node_modules/nib/lib stylus
	rm -f public/stylesheets/style.css
	cat stylus/compiled/* >> public/stylesheets/style.css
	cp components/jquery/jquery.min.js public/javascripts/jquery-min.js

all:
	style
