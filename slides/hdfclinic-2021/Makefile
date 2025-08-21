# Copyright (c) 2020 vargaconsulting, Toronto,ON Canada
# Author: Varga, Steven <steven@vargaconsulting.ca>

view:
	grunt serve

grunt-install:
	npm install -g grunt-cli

speaker-view:
	node plugin/notes-server

website-init:
	aws s3 website s3://string-performance.h5cpp.org --index-document index.html --error-document error.html


upload:
	grunt
	grunt zip
	unzip string-performance.zip -d upload	
	aws s3 sync upload s3://string-performance.h5cpp.org
	rm -rf upload
.PHONY: upload


