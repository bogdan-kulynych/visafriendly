NODE_MODULES=node_modules
NODE_BINARIES=${NODE_MODULES}/.bin
MAIN=src/index.js
OUTFILE=lib/bundle.js

BABEL_PRESETS=--presets [ @babel/preset-env @babel/preset-react ]
BABEL_PLUGINS=

FLAGS= \
	--transform [ babelify ${BABEL_PLUGINS} ${BABEL_PRESETS} ] \
	--outfile ${OUTFILE} \
	${MAIN}

build:
	${NODE_BINARIES}/browserify ${FLAGS}

watch:
	${NODE_BINARIES}/watchify --debug --verbose ${FLAGS}
