# Copyright (c) 2020 vargaconsulting, Toronto,ON Canada
# Author: Varga, Steven <steven@vargaconsulting.ca>

view:
	npm start

speaker-view:
	node plugin/notes-server

upload:
	mkdir -p upload
	cp -rf {dist,index.html,plugin,js,benchmark.json}  upload/
	aws s3 sync upload s3://benchmark-ehug2021.h5cpp.org
	rm -rf upload
.PHONY: upload


