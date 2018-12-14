# Makefile for transpiling with Babel in a Node app, or in a client- or
# server-side shared library.

.PHONY: all clean

# Install `babel-cli` in a project to get the transpiler.
babel := node_modules/.bin/babel

# Identify modules to be transpiled by recursively searching the `src/`
# directory.
src_files := $(shell find src/ -name '*.js')

# Building will involve copying every `.js` file from `src/` to a corresponding
# file in `lib/` with a `.js.flow` extension. Then we will run `babel` to
# transpile copied files, where the transpiled file will get a `.js` extension.
# This assignment computes the list of transpiled `.js` that we expect to end up;
# and we will work backward from there to figure out how to build them.
transpiled_files := $(patsubst src/%,lib/%,$(src_files))

# Putting each generated file in the same directory with its corresponding
# source file is important when working with Flow: during type-checking Flow
# will look in npm packages for `.js.flow` files to find type definitions. So
# putting `.js` and `.js.flow` files side-by-side is how you export type
# definitions from a shared library.

# Compute the list of type-definition source files that we want to end up with.
# This is done by replacing the `.js` extension from every value in the
# `transpiled_files` list with a `.js.flow` extension.
flow_files := $(patsubst %.js,%.js.flow,$(transpiled_files))

# Ask `make` to build all of the transpiled `.js` and `.js.flow` files that we
# want to end up with in `lib/`.
#
# This target also depends on the `node_modules/` directory, so that `make`
# automatically runs `npm install` if `package.json` has changed.
all: node_modules $(flow_files) $(transpiled_files)

# This rule tells `make` how to transpile a source file using `babel`.
# Transpiled files will be written to `lib/`
lib/%: src/%
	mkdir -p $(dir $@)
	$(babel) $< --out-file $@ --source-maps

# Transpiling one file at a time makes incremental transpilation faster:
# `make` will only transpile source files that have changed since the last
# invocation.

# This rule tells `make` how to produce a `.js.flow` file. It is just a copy of
# a source file - the rule copies a file from `src/` to `lib/` and changes the
# extension.
lib/%.js.flow: src/%.js
	mkdir -p $(dir $@)
	cp $< $@

clean:
	rm -rf lib

# This rule informs `make` that the `node_modules/` directory is out-of-date
# after changes to `package.json` or `package-lock.json`, and instructs `make` on how to
# install modules to get back up-to-date.
node_modules: package.json package-lock.json
	npm install
