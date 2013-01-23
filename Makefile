test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--require should \
		test/*.test.js

clean:
	@rm -fr node_modules

.PHONY: run clean test
