/**
 * Collect objects here which should be exported for this
 * npm module
 */

var main = require('./lib/digi');
var tuner = require('./lib/tuner');


module.exports = {

	Digi: main.Digi,
	OutText: main.OutText,
	InText: main.InText,
	Tuner: tuner.Tuner,
	TunerImpl: tuner.TunerImpl

};