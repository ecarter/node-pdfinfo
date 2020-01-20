test:
	@./node_modules/.bin/mocha test/*

clean:
	@rm -fr node_modules

.PHONY: run clean test
