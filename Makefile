.PHONY: install build start test dev clean docker-up docker-down

install:
	npm install
	cd server && npm install
	cd client && npm install

build:
	npm run build

start:
	node app.js

dev:
	npm run dev

test:
	npm run test

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

clean:
	rm -rf node_modules client/dist coverage
