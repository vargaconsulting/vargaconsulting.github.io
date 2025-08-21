# Copyright (c) 2018 vargaconsulting, Toronto,ON Canada
# Author: Varga, Steven <steven@vargaconsulting.ca>


run:
	grunt serve


upload:
	grunt  	
	rsync -a  js osaka.vargaconsulting.ca:/var/www/isc19/
	rsync -a  css osaka.vargaconsulting.ca:/var/www/isc19/
	rsync -a  pix osaka.vargaconsulting.ca:/var/www/isc19/
	rsync -a  lib osaka.vargaconsulting.ca:/var/www/isc19/
	rsync -a  plugin osaka.vargaconsulting.ca:/var/www/isc19/
	rsync -a  data osaka.vargaconsulting.ca:/var/www/isc19/
	rsync -a  index.html osaka.vargaconsulting.ca:/var/www/isc19/
	
.PHONY: upload


