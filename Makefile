NODE_MODULES=node_modules
NODE_BINARIES=${NODE_MODULES}/.bin
MAIN=src/app.js

BABEL_PRESETS=
BABEL_PLUGINS=

FLAGS= \
	--transform [ babelify ${BABEL_PLUGINS} ${BABEL_PRESETS} ] \
	--outfile lib/app.js \
	${MAIN}

build:
	${NODE_BINARIES}/browserify ${FLAGS}

watch:
	${NODE_BINARIES}/watchify --debug --verbose ${FLAGS}
