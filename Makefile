style:
	stylus --compress --out stylus/compiled stylus
	rm -f public/stylesheets/style.css
	cat stylus/compiled/* >> public/stylesheets/style.css


all:
	style
