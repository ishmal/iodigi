module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Digi = exports.InText = exports.OutText = undefined;

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _constants = __webpack_require__(6);

	var _fft = __webpack_require__(7);

	var _audio = __webpack_require__(18);

	var _mode = __webpack_require__(20);

	var _psk = __webpack_require__(23);

	var _rtty = __webpack_require__(71);

	var _packet = __webpack_require__(73);

	var _navtex = __webpack_require__(74);

	var _watch = __webpack_require__(75);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Interface for a text output widget, which the UI should overload
	 */

	var OutText = exports.OutText = function () {
	    function OutText() {
	        (0, _classCallCheck3.default)(this, OutText);
	    }

	    (0, _createClass3.default)(OutText, [{
	        key: "clear",
	        value: function clear() {}
	    }, {
	        key: "putText",
	        value: function putText() {}
	    }]);
	    return OutText;
	}();

	/**
	 * Interface for a test input widget, which the UI should overload
	 */
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var InText = exports.InText = function () {
	    function InText() {
	        (0, _classCallCheck3.default)(this, InText);
	    }

	    (0, _createClass3.default)(InText, [{
	        key: "clear",
	        value: function clear() {}
	    }, {
	        key: "getText",
	        value: function getText() {}
	    }]);
	    return InText;
	}();

	/**
	 * This is the top-level GUI-less app.  Extend this with a GUI.
	 */

	var Digi = exports.Digi = function () {
	    function Digi() {
	        (0, _classCallCheck3.default)(this, Digi);

	        this._audioInput = new _audio.AudioInput(this);
	        this._audioOutput = new _audio.AudioOutput(this);
	        this._watcher = new _watch.Watcher(this);
	        this._txmode = false;
	        /**
	         * Add our modes here and set the default
	         */
	        this.pskMode = new _psk.PskMode2(this);
	        this.rttyMode = new _rtty.RttyMode(this);
	        this.packetMode = new _packet.PacketMode(this);
	        this.navtexMode = new _navtex.NavtexMode(this);
	        this._mode = this.pskMode;
	        this.modes = [this.pskMode, this.rttyMode, this.packetMode, this.navtexMode];

	        this._tuner = new Tuner();
	        this._outtext = new OutText();
	        this._intext = new InText();

	        setupReceive();
	    }

	    (0, _createClass3.default)(Digi, [{
	        key: "setupReceive",
	        value: function setupReceive() {
	            var FFT_MASK = _constants.Constants.FFT_SIZE - 1;
	            var FFT_WINDOW = 700;
	            var fft = new _fft.FFTSR(_constants.Constants.FFT_SIZE);
	            var ibuf = new Float32Array(_constants.Constants.FFT_SIZE);
	            var iptr = 0;
	            var icnt = 0;
	            var psbuf = new Float32Array(_constants.Constants.BINS);

	            this._receive = function (data) {
	                this._mode.receiveData(data);
	                ibuf[iptr++] = data;
	                iptr &= FFT_MASK;
	                if (++icnt >= FFT_WINDOW) {
	                    icnt = 0;
	                    fft.powerSpectrum(ibuf, psbuf);
	                    //console.log("ps: " + ps[100]);
	                    self.tuner.update(psbuf);
	                    mode.receiveFft(psbuf);
	                }
	            };
	        }
	    }, {
	        key: "receive",
	        value: function receive(data) {
	            this._receive(data);
	        }
	    }, {
	        key: "trace",
	        value: function trace(msg) {
	            if (typeof console !== "undefined") console.log("Digi: " + msg);
	        }
	    }, {
	        key: "error",
	        value: function error(msg) {
	            if (typeof console !== "undefined") console.log("Digi error: " + msg);
	        }
	    }, {
	        key: "status",
	        value: function status(str) {
	            if (typeof console !== "undefined") console.log("status: " + str);
	        }
	    }, {
	        key: "showScope",

	        /**
	         * Override this in the GUI
	         */
	        value: function showScope(data) {
	            this._tuner.showScope(data);
	        }

	        /**
	         * Make this an interface, so we can add things later.
	         * Let the GUI override this.
	         */

	    }, {
	        key: "putText",

	        /**
	         * Output text to the gui
	         */
	        value: function putText(str) {
	            this._outtext.putText(str);
	            watcher.update(str);
	        }

	        /**
	         * Make this an interface, so we can add things later.
	         * Let the GUI override this.
	         */

	    }, {
	        key: "getText",

	        /**
	         * Input text from the gui
	         */
	        value: function getText() {
	            return this._intext.getText();
	        }
	    }, {
	        key: "clear",
	        value: function clear() {
	            this._outtext.clear();
	            this._intext.clear();
	        }
	    }, {
	        key: "transmit",
	        value: function transmit(data) {
	            return this._mode.getTransmitData();
	        }
	    }, {
	        key: "start",
	        value: function start() {
	            this._audioInput.start();
	            this._audioOutput.start();
	        }
	    }, {
	        key: "stop",
	        value: function stop() {
	            this._audioInput.stop();
	            this._audioOutput.stop();
	        }
	    }, {
	        key: "sampleRate",
	        get: function get() {
	            return this._audioInput.sampleRate;
	        }
	    }, {
	        key: "mode",
	        set: function set(v) {
	            this._mode = v;
	            //this.status("mode switched");
	        },
	        get: function get() {
	            return this._mode;
	        }
	    }, {
	        key: "bandwidth",
	        get: function get() {
	            return this._mode.getBandwidth();
	        }
	    }, {
	        key: "frequency",
	        set: function set(freq) {
	            this._mode.setFrequency(freq);
	        },
	        get: function get() {
	            return this._mode.getFrequency();
	        }
	    }, {
	        key: "useAfc",
	        get: function get() {
	            return this._mode.useAfc;
	        },
	        set: function set(v) {
	            this._mode.useAfc = v;
	        }
	    }, {
	        key: "useQrz",
	        get: function get() {
	            return this._watcher.getUseQrz();
	        },
	        set: function set(v) {
	            this._watcher.setUseQrz(v);
	        }
	    }, {
	        key: "txMode",
	        get: function get() {
	            return _txmode;
	        },
	        set: function set(v) {
	            this._txmode = v;
	            if (v) {
	                this._audioInput.setEnabled(false);
	                this._audioOutput.setEnabled(true);
	            } else {
	                this._audioInput.setEnabled(true);
	                this._audioOutput.setEnabled(false);
	            }
	        }
	    }, {
	        key: "tuner",
	        get: function get() {
	            return this._tuner;
	        },
	        set: function set(tuner) {
	            this._tuner = tuner;
	        }
	    }, {
	        key: "outText",
	        get: function get() {
	            return this._outtext;
	        },
	        set: function set(val) {
	            this._outtext = val;
	        }
	    }, {
	        key: "inText",
	        get: function get() {
	            return this._intext;
	        },
	        set: function set(val) {
	            this._intext = val;
	        }
	    }]);
	    return Digi;
	}(); //Digi

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(3);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(5);
	module.exports = function defineProperty(it, key, desc) {
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var $Object = Object;
	module.exports = {
	  create: $Object.create,
	  getProto: $Object.getPrototypeOf,
	  isEnum: {}.propertyIsEnumerable,
	  getDesc: $Object.getOwnPropertyDescriptor,
	  setDesc: $Object.defineProperty,
	  setDescs: $Object.defineProperties,
	  getKeys: $Object.keys,
	  getNames: $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each: [].forEach
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var Constants = {
	  FFT_SIZE: 2048,
	  BINS: 1024
	};

	exports.Constants = Constants;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SimpleGoertzel = exports.FFTSR = exports.FFT = undefined;

	var _math = __webpack_require__(8);

	var _window = __webpack_require__(17);

	/**
	 * Perform a relatively-efficient FFT
	 */
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	function FFT(N) {

	    var N2 = N / 2;
	    var power = Math.log(N) / Math.LN2 | 0;
	    var nrStages = power;
	    //todo: validate power-of-2, throw IAE if not

	    function createBitReversedIndices(n) {
	        var xs = new Array(n);
	        for (var i = 0; i < n; i++) {
	            var np = n;
	            var index = i;
	            var bitreversed = 0;
	            while (np > 1) {
	                bitreversed <<= 1;
	                bitreversed += index & 1;
	                index >>= 1;
	                np >>= 1;
	            }
	            xs[i] = bitreversed;
	        }
	        return xs;
	    }

	    var bitReversedIndices = createBitReversedIndices(N);

	    /**
	     * This piece does not need to be fast, just correct
	     */
	    function generateStageData() {
	        var xs = [];
	        var span = 1;
	        var wspan = N2;
	        var ninv = 1 / N;
	        for (var stage = 0; stage < nrStages; stage++, span <<= 1, wspan >>= 1) {
	            var stageData = [];
	            for (submatrix = 0; submatrix < N2 / span; submatrix++) {
	                var np = submatrix * span * 2;
	                var ni = np;
	                for (node = 0; node < span; node++) {
	                    var l = ni;
	                    var r = ni + span;
	                    var idx = node * wspan;
	                    var wr = Math.cos(Math.PI * 2.0 * node * wspan * ninv);
	                    var wi = Math.sin(Math.PI * 2.0 * node * wspan * ninv);
	                    stageData[stageData.length] = { l: l, r: r, wr: wr, wi: wi, idx: idx };
	                    ni++;
	                }
	            }
	            xs[xs.length] = stageData;
	        }
	        return xs;
	    }

	    var stages = generateStageData();

	    function apply(input) {

	        //local refs
	        var n2 = N2;
	        var nrStgs = nrStages;
	        var stgs = stages;

	        var xr = new Array(N);
	        var xi = new Array(N);
	        for (var idx = 0; idx < N; idx++) {
	            //todo:  apply Hann window here
	            var bri = bitReversedIndices[idx];
	            xr[idx] = input[bri];
	            xi[idx] = 0;
	        }

	        for (var stage = 0; stage < nrStgs; stage++) {
	            var stageData = stgs[stage];
	            for (var i = 0; i < n2; i++) {
	                var parms = stageData[i];
	                var wr = parms.wr;
	                var wi = parms.wi;
	                var left = parms.l;
	                var right = parms.r;
	                var leftr = xr[left];
	                var lefti = xi[left];
	                var rightr = wr * xr[right] - wi * xi[right];
	                var righti = wi * xr[right] + wr * xi[right];
	                xr[left] = leftr + rightr;
	                xi[left] = lefti + righti;
	                xr[right] = leftr - rightr;
	                xi[right] = lefti - righti;
	            }
	        }
	        return { r: xr, i: xi };
	    }

	    function powerSpectrum(input) {

	        var x = apply(input);
	        var xr = x.r;
	        var xi = x.i;
	        var len = N2;

	        var ps = new Array(len);
	        for (var j = 0; j < len; j++) {
	            var r = xr[j];
	            var i = xi[j];
	            ps[j] = r * r + i * i;
	        }
	        return ps;
	    }

	    this.powerSpectrum = powerSpectrum;
	} //FFT

	/**
	 * Perform a very efficient FFT.  Split Radix!
	 */
	function FFTSR(N) {

	    var power = Math.log(N) / Math.LN2 | 0;
	    var N2 = N >> 1;

	    function generateBitReversedIndices(n) {
	        var xs = new Array(n);
	        for (var i = 0; i < n; i++) {
	            var np = n;
	            var index = i;
	            var bitreversed = 0;
	            while (np > 1) {
	                bitreversed <<= 1;
	                bitreversed += index & 1;
	                index >>= 1;
	                np >>= 1;
	            }
	            xs[i] = bitreversed;
	        }
	        return xs;
	    }

	    var bitReversedIndices = generateBitReversedIndices(N);

	    //let's pre-generate anything we can
	    function generateStageData(pwr) {
	        var xs = [];
	        var n2 = N; // == n>>(k-1) == n, n/2, n/4, ..., 4
	        var n4 = n2 >> 2; // == n/4, n/8, ..., 1
	        for (var k = 1; k < pwr; k++, n2 >>= 1, n4 >>= 1) {
	            var stage = [];
	            var e = 2.0 * Math.PI / n2;
	            for (var j = 1; j < n4; j++) {
	                var a = j * e;
	                stage[stage.length] = {
	                    wr1: Math.cos(a), wi1: Math.sin(a),
	                    wr3: Math.cos(3 * a), wi3: Math.sin(3 * a)
	                };
	            }
	            xs[xs.length] = stage;
	        }
	        return xs;
	    }

	    var stages = generateStageData(power);
	    var W = _window.Window.hann(N);
	    var xr = new Float32Array(N);
	    var xi = new Float32Array(N);
	    var ZEROES = new Float32Array(N);

	    /**
	     * Real samples
	     */
	    function apply(input) {
	        xr.set(input);
	        xi.set(ZEROES);
	        compute();
	    }

	    /**
	     * Complex samples
	     */
	    function applyX(input) {
	        for (var idx = 0; idx < N; idx++) {
	            var cx = input[idx];
	            xr[idx] = cx.r; // * W[idx];
	            xi[idx] = cx.i;
	        }
	        compute();
	    }

	    function compute() {
	        var ix = undefined,
	            id = undefined,
	            i0 = undefined,
	            i1 = undefined,
	            i2 = undefined,
	            i3 = undefined;
	        var j = undefined,
	            k = undefined;
	        var tr = undefined,
	            ti = undefined,
	            tr0 = undefined,
	            ti0 = undefined,
	            tr1 = undefined,
	            ti1 = undefined;
	        var n2 = undefined,
	            n4 = undefined;

	        var stageidx = 0;

	        n2 = N; // == n>>(k-1) == n, n/2, n/4, ..., 4
	        n4 = n2 >> 2; // == n/4, n/8, ..., 1
	        for (k = 1; k < power; k++, n2 >>= 1, n4 >>= 1) {

	            var stage = stages[stageidx++];

	            id = n2 << 1;
	            for (ix = 0; ix < N; ix = (id << 1) - n2, id <<= 2) {
	                //ix=j=0
	                for (i0 = ix; i0 < N; i0 += id) {
	                    i1 = i0 + n4;
	                    i2 = i1 + n4;
	                    i3 = i2 + n4;

	                    //sumdiff3(x[i0], x[i2], t0);
	                    tr0 = xr[i0] - xr[i2];
	                    ti0 = xi[i0] - xi[i2];
	                    xr[i0] += xr[i2];
	                    xi[i0] += xi[i2];
	                    //sumdiff3(x[i1], x[i3], t1);
	                    tr1 = xr[i1] - xr[i3];
	                    ti1 = xi[i1] - xi[i3];
	                    xr[i1] += xr[i3];
	                    xi[i1] += xi[i3];

	                    // t1 *= Complex(0, 1);  // +isign
	                    tr = tr1;
	                    tr1 = -ti1;
	                    ti1 = tr;

	                    //sumdiff(t0, t1);
	                    tr = tr1 - tr0;
	                    ti = ti1 - ti0;
	                    tr0 += tr1;
	                    ti0 += ti1;
	                    tr1 = tr;
	                    ti1 = ti;

	                    xr[i2] = tr0; // .mul(w1);
	                    xi[i2] = ti0; // .mul(w1);
	                    xr[i3] = tr1; // .mul(w3);
	                    xi[i3] = ti1; // .mul(w3);
	                }
	            }

	            var dataindex = 0;

	            for (j = 1; j < n4; j++) {

	                var data = stage[dataindex++];
	                var wr1 = data.wr1;
	                var wi1 = data.wi1;
	                var wr3 = data.wr3;
	                var wi3 = data.wi3;

	                id = n2 << 1;
	                for (ix = j; ix < N; ix = (id << 1) - n2 + j, id <<= 2) {
	                    for (i0 = ix; i0 < N; i0 += id) {
	                        i1 = i0 + n4;
	                        i2 = i1 + n4;
	                        i3 = i2 + n4;

	                        //sumdiff3(x[i0], x[i2], t0);
	                        tr0 = xr[i0] - xr[i2];
	                        ti0 = xi[i0] - xi[i2];
	                        xr[i0] += xr[i2];
	                        xi[i0] += xi[i2];
	                        //sumdiff3(x[i1], x[i3], t1);
	                        tr1 = xr[i1] - xr[i3];
	                        ti1 = xi[i1] - xi[i3];
	                        xr[i1] += xr[i3];
	                        xi[i1] += xi[i3];

	                        // t1 *= Complex(0, 1);  // +isign
	                        tr = tr1;
	                        tr1 = -ti1;
	                        ti1 = tr;

	                        //sumdiff(t0, t1);
	                        tr = tr1 - tr0;
	                        ti = ti1 - ti0;
	                        tr0 += tr1;
	                        ti0 += ti1;
	                        tr1 = tr;
	                        ti1 = ti;

	                        xr[i2] = tr0 * wr1 - ti0 * wi1; // .mul(w1);
	                        xi[i2] = ti0 * wr1 + tr0 * wi1; // .mul(w1);
	                        xr[i3] = tr1 * wr3 - ti1 * wi3; // .mul(w3);
	                        xi[i3] = ti1 * wr3 + tr1 * wi3; // .mul(w3);
	                    }
	                }
	            }
	        }

	        for (ix = 0, id = 4; ix < N; id <<= 2) {
	            for (i0 = ix; i0 < N; i0 += id) {
	                i1 = i0 + 1;
	                tr = xr[i1] - xr[i0];
	                ti = xi[i1] - xi[i0];
	                xr[i0] += xr[i1];
	                xi[i0] += xi[i1];
	                xr[i1] = tr;
	                xi[i1] = ti;
	            }
	            ix = id + id - 2; //2*(id-1);
	        }
	    } //apply

	    function computePowerSpectrum(ps) {
	        var len = N2;
	        var indices = bitReversedIndices;
	        for (var j = 0; j < len; j++) {
	            var bri = indices[j];
	            var r = xr[bri];
	            var i = xi[bri];
	            ps[j] = r * r + i * i;
	        }
	    }

	    function powerSpectrum(input, ps) {
	        apply(input);
	        computePowerSpectrum(ps);
	    }

	    this.powerSpectrum = powerSpectrum;

	    function powerSpectrumX(input, ps) {
	        applyX(input);
	        computePowerSpectrum(ps);
	    }

	    this.powerSpectrumX = powerSpectrumX;
	} //FFTSR

	function SimpleGoertzel(frequency, binWidth, sampleRate) {

	    //how many bins would there be for this binWidth? Integer
	    var N = sampleRate / binWidth | 0;
	    //which bin out of N are we? Must be an integer.
	    var bin = 0.5 + frequency / sampleRate * N | 0;
	    var w = 2.0 * Math.PI / N * bin; //omega
	    var wr = Math.cos(w);
	    var wr2 = 2.0 * wr;
	    var wi = Math.sin(w);
	    var pr1 = 0,
	        pr2 = 0,
	        pi1 = 0,
	        pi2 = 0;
	    var damping = 0.999;

	    this.N = N;

	    this.reset = function () {
	        pr1 = 0;
	        pr2 = 0;
	        pi1 = 0;
	        pi2 = 0;
	    };

	    //use this if computed with update()
	    this.x = function () {
	        return new _math.Complex(wr * pr1 - pr2, wi * pr1);
	    };

	    //use this if computed with updateX()
	    this.X = function () {
	        var realr = wr * pr1 - pr2;
	        var reali = wi * pr1;
	        var imagr = wr * pi1 - p12;
	        var imagi = wi * pi1;
	        return { r: realr - imagi, i: reali + imagr };
	    };

	    //faster for power spectrum
	    this.mag = function () {
	        return pr1 * pr1 + pr2 * pr2;
	    };

	    //correct
	    this.mag2 = function () {
	        return pr1 * pr1 + pr2 * pr2 - wr2 * pr1 * pr2;
	    };

	    //for complex values
	    this.magX = function () {
	        return _math.Complex.mag(this.X());
	    };

	    this.update = function (point) {
	        var r = point + (pr1 * wr2 - pr2);
	        pr2 = pr1 - point;
	        pr1 = r;
	    };

	    this.updateX = function (point) {
	        var r = point.r + (pr1 * wr2 - pr2);
	        pr2 = pr1 - point.r;
	        pr1 = r * damping;
	        var i = point.i + (pi1 * wr2 - pi2);
	        pi2 = pi1 - point.i;
	        pi1 = i * damping;
	    };
	}

	exports.FFT = FFT;
	exports.FFTSR = FFTSR;
	exports.SimpleGoertzel = SimpleGoertzel;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Complex = undefined;

	var _hypot = __webpack_require__(9);

	var _hypot2 = _interopRequireDefault(_hypot);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var Complex = {
	    add: function add(a, b) {
	        return { r: a.r + b.r, i: a.i + b.i };
	    },
	    sub: function sub(a, b) {
	        return { r: a.r - b.r, i: a.i - b.i };
	    },
	    scale: function scale(a, v) {
	        return { r: a.r * v, i: a.i * v };
	    },
	    mul: function mul(a, b) {
	        var ar = a.r;
	        var ai = a.i;
	        var br = b.r;
	        var bi = b.i;
	        return { r: ar * br - ai * bi, i: ar * bi + ai * br };
	    },
	    neg: function neg(a) {
	        return { r: -a.r, i: -a.i };
	    },
	    conj: function conj(a) {
	        return { r: a.r, i: -a.i };
	    },
	    mag: function mag(a) {
	        var r = a.r;
	        var i = a.i;
	        return r * r + i * i;
	    },
	    abs: function abs(a) {
	        return (0, _hypot2.default)(a.r, a.i);
	    },
	    arg: function arg(a) {
	        return Math.atan2(a.i, a.r);
	    },
	    ZERO: { r: 0, i: 0 },
	    ONE: { r: 1, i: 0 },
	    I: { r: 0, i: 1 }
	};

	exports.Complex = Complex;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(10), __esModule: true };

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(11);
	module.exports = __webpack_require__(14).Math.hypot;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	var $export = __webpack_require__(12),
	    abs = Math.abs;

	$export($export.S, 'Math', {
	  hypot: function hypot(value1, value2) {
	    // eslint-disable-line no-unused-vars
	    var sum = 0,
	        i = 0,
	        $$ = arguments,
	        $$len = $$.length,
	        larg = 0,
	        arg,
	        div;
	    while (i < $$len) {
	      arg = abs($$[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
	  }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(13),
	    core = __webpack_require__(14),
	    ctx = __webpack_require__(15),
	    PROTOTYPE = 'prototype';

	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F,
	      IS_GLOBAL = type & $export.G,
	      IS_STATIC = type & $export.S,
	      IS_PROTO = type & $export.P,
	      IS_BIND = type & $export.B,
	      IS_WRAP = type & $export.W,
	      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
	      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
	      key,
	      own,
	      out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? function (C) {
	      var F = function F(param) {
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	      // make static versions for prototype methods
	    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	var core = module.exports = { version: '1.2.6' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// optional / simple context binding
	var aFunction = __webpack_require__(16);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }
	  return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * A few Window types
	 */
	var Window = {

	    rectangle: function rectangle(size) {
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = 1.0;
	        }return xs;
	    },

	    bartlett: function bartlett(size) {
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = 2 / (size - 1) * ((size - 1) / 2 - Math.abs(i - (size - 1) / 2));
	        }return xs;
	    },

	    blackman: function blackman(size) {
	        var alpha = 0.16; //the "exact" Blackman
	        var a0 = (1 - alpha) / 2;
	        var a1 = 0.5;
	        var a2 = alpha * 0.5;
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = a0 - a1 * Math.cos(2.0 * Math.PI * i / (size - 1)) + a2 * Math.cos(4 * Math.PI * i / (size - 1));
	        }return xs;
	    },

	    cosine: function cosine(size) {
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = Math.cos(Math.PI * i / (size - 1) - Math.PI / 2);
	        }return xs;
	    },

	    gauss: function gauss(size) {
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = Math.pow(Math.E, -0.5 * Math.pow((i - (size - 1) / 2) / (alpha * (size - 1) / 2), 2));
	        }return xs;
	    },

	    hamming: function hamming(size) {
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = 0.54 - 0.46 * Math.cos(2.0 * Math.PI * i / (size - 1));
	        }return xs;
	    },

	    hann: function hann(size) {
	        var xs = new Array(size);
	        for (var i = 0; i < size; i++) {
	            xs[i] = 0.5 - 0.5 * Math.cos(2.0 * Math.PI * i / (size - 1));
	        }return xs;
	    }

	};

	exports.Window = Window;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/* global window, navigator*/
	/* jslint node: true */

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AudioOutput = exports.AudioInput = undefined;

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _resample = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	//Chrome workaround.  Keep a ref to a scriptprocessor node to prevent gc.
	var scriptNodes = {};
	var keep = function () {
	    var nextNodeID = 1;
	    return function (node) {
	        node.id = node.id || nextNodeID++;
	        scriptNodes[node.id] = node;
	        return node;
	    };
	}();

	var AudioInput = function () {
	    function AudioInput(par) {
	        (0, _classCallCheck3.default)(this, AudioInput);

	        this.par = par;
	        this.actx = new AudioContext();
	        this.decimation = 7;
	        this.sampleRate = this.actx.sampleRate / this.decimation;
	        this.source = null;
	        this.stream = null;
	        this.enabled = false;
	        this.scriptNodes = {};
	    }

	    (0, _createClass3.default)(AudioInput, [{
	        key: "startStream",
	        value: function startStream(newstream) {

	            this.stream = newstream;

	            //workaround for a Firefox bug.  Keep a global ref to source to prevent gc.
	            //http://goo.gl/LjEjUF2
	            //var source = actx.createMediaStreamSource(stream);
	            this.source = this.actx.createMediaStreamSource(newstream);

	            /**/
	            var bufferSize = 8192;
	            var decimator = _resample.Resampler.create(this.decimation);
	            var inputNode = keep(this.actx.createScriptProcessor(4096, 1, 1));
	            this.enabled = true;
	            inputNode.onaudioprocess = function (e) {
	                if (!this.enabled) {
	                    return;
	                }
	                var input = e.inputBuffer.getChannelData(0);
	                var len = input.length;
	                var d = decimator;
	                for (var i = 0; i < len; i++) {
	                    var v = d.decimate(input[i]);
	                    if (v !== false) {
	                        this.par.receive(v);
	                    }
	                }
	            };

	            this.source.connect(inputNode);
	            inputNode.connect(this.actx.destination);
	        }
	    }, {
	        key: "start",
	        value: function start() {
	            var _this = this;

	            navigator.getUserMedia({ audio: true }, function (newStream) {
	                _this.startStream(newStream);
	            }, function (userMediaError) {
	                _this.par.error(userMediaError.name + " : " + userMediaError.message);
	            });
	        }
	    }, {
	        key: "stop",
	        value: function stop() {
	            if (this.stream) this.stream.stop();
	        }
	    }]);
	    return AudioInput;
	}(); //AudioInput

	/**
	 * Getting this to work with interpolation isn't easy
	 */

	var AudioOutput = function () {
	    function AudioOutput(par) {
	        (0, _classCallCheck3.default)(this, AudioOutput);

	        this.par = par;
	        this.actx = new AudioContext();
	        this.sampleRate = this.actx.sampleRate;
	        this.isRunning = false;
	        this.enabled = false;
	    }

	    (0, _createClass3.default)(AudioOutput, [{
	        key: "start",
	        value: function start() {

	            /**/
	            var bufferSize = 4096;
	            var decimation = 7;
	            var ibuf = new Float32Array(decimation);
	            var iptr = decimation;
	            var resampler = _resample.Resampler.create(decimation);
	            var outputNode = keep(this.actx.createScriptProcessor(bufferSize, 0, 1));
	            outputNode.onaudioprocess = function (e) {
	                if (!this.enabled) {
	                    return;
	                }
	                var output = e.outputBuffer.getChannelData(0);
	                var len = output.length;
	                for (var i = 0; i < len; i++) {
	                    if (iptr >= decimation) {
	                        var v = this.par.transmit();
	                        resampler.interpolate(v, ibuf);
	                        iptr = 0;
	                    }
	                    output[i] = ibuf[iptr++];
	                }
	            };

	            outputNode.connect(this.actx.destination);
	            this.isRunning = true;
	        }
	    }, {
	        key: "stop",
	        value: function stop() {
	            this.source.close();
	            this.isRunning = false;
	        }
	    }]);
	    return AudioOutput;
	}(); //AudioOutput

	exports.AudioInput = AudioInput;
	exports.AudioOutput = AudioOutput;

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * ### decimation : 1
	 */
	function Resampler1() {
	    this.value = 0;

	    this.decimate = function (v) {
	        value = v;
	        return true;
	    };

	    this.decimatex = function (v) {
	        value = v;
	        return true;
	    };

	    this.interpolate = function (v, buf) {
	        buf[0] = v;
	    };

	    this.interpolatex = function (v, buf) {
	        buf[0] = v;
	    };
	}

	//######################################
	//## GENERATED
	//######################################
	/**
	 * ### decimation : 2
	 */
	function Resampler2() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = v;
	        if (++idx >= 2) {
	            idx = 0;
	            return r2 * 0.90451;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = vr;
	        i3 = vi;
	        if (++idx >= 2) {
	            idx = 0;
	            return {
	                r: r2 * 0.90451,
	                i: i2 * 0.90451
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = 0;
	        buf[1] = r1 * 0.90451;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = { r: 0, i: 0 };
	        buf[1] = {
	            r: r1 * 0.90451,
	            i: i1 * 0.90451
	        };
	    };
	}

	/**
	 * ### decimation : 3
	 */
	function Resampler3() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;
	    var r4 = 0;
	    var i4 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = r4;
	        r4 = v;
	        if (++idx >= 3) {
	            idx = 0;
	            return r1 * 0.21783 + r2 * 0.48959 + r3 * 0.21783;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = r4;
	        i3 = i4;
	        r4 = vr;
	        i4 = vi;
	        if (++idx >= 3) {
	            idx = 0;
	            return {
	                r: r1 * 0.21783 + r2 * 0.48959 + r3 * 0.21783,
	                i: i1 * 0.21783 + i2 * 0.48959 + i3 * 0.21783
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = r1 * 0.21783 + r2 * -0.06380;
	        buf[1] = r1 * 0.61719;
	        buf[2] = r0 * -0.06380 + r1 * 0.21783;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = {
	            r: r1 * 0.21783 + r2 * -0.06380,
	            i: i1 * 0.21783 + i2 * -0.06380
	        };
	        buf[1] = {
	            r: r1 * 0.61719,
	            i: i1 * 0.61719
	        };
	        buf[2] = {
	            r: r0 * -0.06380 + r1 * 0.21783,
	            i: i0 * -0.06380 + i1 * 0.21783
	        };
	    };
	}

	/**
	 * ### decimation : 4
	 */
	function Resampler4() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;
	    var r4 = 0;
	    var i4 = 0;
	    var r5 = 0;
	    var i5 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = r4;
	        r4 = r5;
	        r5 = v;
	        if (++idx >= 4) {
	            idx = 0;
	            return r1 * 0.00480 + r2 * 0.29652 + r3 * 0.37867 + r4 * 0.25042;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = r4;
	        i3 = i4;
	        r4 = r5;
	        i4 = i5;
	        r5 = vr;
	        i5 = vi;

	        if (++idx >= 4) {
	            idx = 0;
	            return {
	                r: r1 * 0.00480 + r2 * 0.29652 + r3 * 0.37867 + r4 * 0.25042,
	                i: i1 * 0.00480 + i2 * 0.29652 + i3 * 0.37867 + i4 * 0.25042
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = 0;
	        buf[1] = r0 * 0.00480 + r1 * 0.29652 + r2 * -0.02949;
	        buf[2] = r1 * 0.46578;
	        buf[3] = r0 * -0.05762 + r1 * 0.25042;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = { r: 0, i: 0 };
	        buf[1] = {
	            r: r0 * 0.00480 + r1 * 0.29652 + r2 * -0.02949,
	            i: i0 * 0.00480 + i1 * 0.29652 + i2 * -0.02949
	        };
	        buf[2] = {
	            r: r1 * 0.46578,
	            i: i1 * 0.46578
	        };
	        buf[3] = {
	            r: r0 * -0.05762 + r1 * 0.25042,
	            i: i0 * -0.05762 + i1 * 0.25042
	        };
	    };
	}

	/**
	 * ### decimation : 5
	 */
	function Resampler5() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;
	    var r4 = 0;
	    var i4 = 0;
	    var r5 = 0;
	    var i5 = 0;
	    var r6 = 0;
	    var i6 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = r4;
	        r4 = r5;
	        r5 = r6;
	        r6 = v;
	        if (++idx >= 5) {
	            idx = 0;
	            return r1 * 0.07325 + r2 * 0.23311 + r3 * 0.31859 + r4 * 0.23311 + r5 * 0.07325;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = r4;
	        i3 = i4;
	        r4 = r5;
	        i4 = i5;
	        r5 = r6;
	        i5 = i6;
	        r6 = vr;
	        i6 = vi;
	        if (++idx >= 5) {
	            idx = 0;
	            return {
	                r: r1 * 0.07325 + r2 * 0.23311 + r3 * 0.31859 + r4 * 0.23311 + r5 * 0.07325,
	                i: i1 * 0.07325 + i2 * 0.23311 + i3 * 0.31859 + i4 * 0.23311 + i5 * 0.07325
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = r1 * 0.07092 + r2 * -0.03560;
	        buf[1] = r0 * 0.00233 + r1 * 0.26871 + r2 * -0.02747;
	        buf[2] = r1 * 0.37354;
	        buf[3] = r0 * -0.02747 + r1 * 0.26871 + r2 * 0.00233;
	        buf[4] = r0 * -0.03560 + r1 * 0.07092;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = {
	            r: r1 * 0.07092 + r2 * -0.03560,
	            i: i1 * 0.07092 + i2 * -0.03560
	        };
	        buf[1] = {
	            r: r0 * 0.00233 + r1 * 0.26871 + r2 * -0.02747,
	            i: i0 * 0.00233 + i1 * 0.26871 + i2 * -0.02747
	        };
	        buf[2] = {
	            r: r1 * 0.37354,
	            i: i1 * 0.37354
	        };
	        buf[3] = {
	            r: r0 * -0.02747 + r1 * 0.26871 + r2 * 0.00233,
	            i: i0 * -0.02747 + i1 * 0.26871 + i2 * 0.00233
	        };
	        buf[4] = {
	            r: r0 * -0.03560 + r1 * 0.07092,
	            i: i0 * -0.03560 + i1 * 0.07092
	        };
	    };
	}

	/**
	 * ### decimation : 6
	 */
	function Resampler6() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;
	    var r4 = 0;
	    var i4 = 0;
	    var r5 = 0;
	    var i5 = 0;
	    var r6 = 0;
	    var i6 = 0;
	    var r7 = 0;
	    var i7 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = r4;
	        r4 = r5;
	        r5 = r6;
	        r6 = r7;
	        r7 = v;
	        if (++idx >= 6) {
	            idx = 0;
	            return r1 * 0.00110 + r2 * 0.12515 + r3 * 0.22836 + r4 * 0.27379 + r5 * 0.19920 + r6 * 0.10546;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = r4;
	        i3 = i4;
	        r4 = r5;
	        i4 = i5;
	        r5 = r6;
	        i5 = i6;
	        r6 = r7;
	        i6 = i7;
	        r7 = vr;
	        i7 = vi;
	        if (++idx >= 6) {
	            idx = 0;
	            return {
	                r: r1 * 0.00110 + r2 * 0.12515 + r3 * 0.22836 + r4 * 0.27379 + r5 * 0.19920 + r6 * 0.10546,
	                i: i1 * 0.00110 + i2 * 0.12515 + i3 * 0.22836 + i4 * 0.27379 + i5 * 0.19920 + i6 * 0.10546
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = 0;
	        buf[1] = r0 * 0.00110 + r1 * 0.12030 + r2 * -0.02951;
	        buf[2] = r0 * 0.00485 + r1 * 0.25787 + r2 * -0.01442;
	        buf[3] = r1 * 0.31182;
	        buf[4] = r0 * -0.02361 + r1 * 0.24061 + r2 * 0.00125;
	        buf[5] = r0 * -0.04141 + r1 * 0.10420;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = { r: 0, i: 0 };
	        buf[1] = {
	            r: r0 * 0.00110 + r1 * 0.12030 + r2 * -0.02951,
	            i: i0 * 0.00110 + i1 * 0.12030 + i2 * -0.02951
	        };
	        buf[2] = {
	            r: r0 * 0.00485 + r1 * 0.25787 + r2 * -0.01442,
	            i: i0 * 0.00485 + i1 * 0.25787 + i2 * -0.01442
	        };
	        buf[3] = {
	            r: r1 * 0.31182,
	            i: i1 * 0.31182
	        };
	        buf[4] = {
	            r: r0 * -0.02361 + r1 * 0.24061 + r2 * 0.00125,
	            i: i0 * -0.02361 + i1 * 0.24061 + i2 * 0.00125
	        };
	        buf[5] = {
	            r: r0 * -0.04141 + r1 * 0.10420,
	            i: i0 * -0.04141 + i1 * 0.10420
	        };
	    };
	}

	/**
	 * ### decimation : 7
	 */
	function Resampler7() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;
	    var r4 = 0;
	    var i4 = 0;
	    var r5 = 0;
	    var i5 = 0;
	    var r6 = 0;
	    var i6 = 0;
	    var r7 = 0;
	    var i7 = 0;
	    var r8 = 0;
	    var i8 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = r4;
	        r4 = r5;
	        r5 = r6;
	        r6 = r7;
	        r7 = r8;
	        r8 = v;
	        if (++idx >= 7) {
	            idx = 0;
	            return r1 * 0.03499 + r2 * 0.11298 + r3 * 0.19817 + r4 * 0.24057 + r5 * 0.19817 + r6 * 0.11298 + r7 * 0.03499;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = r4;
	        i3 = i4;
	        r4 = r5;
	        i4 = i5;
	        r5 = r6;
	        i5 = i6;
	        r6 = r7;
	        i6 = i7;
	        r7 = r8;
	        i7 = i8;
	        r8 = vr;
	        i8 = vi;
	        if (++idx >= 7) {
	            idx = 0;
	            return {
	                r: r1 * 0.03499 + r2 * 0.11298 + r3 * 0.19817 + r4 * 0.24057 + r5 * 0.19817 + r6 * 0.11298 + r7 * 0.03499,
	                i: i1 * 0.03499 + i2 * 0.11298 + i3 * 0.19817 + i4 * 0.24057 + i5 * 0.19817 + i6 * 0.11298 + i7 * 0.03499
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = r1 * 0.03420 + r2 * -0.02115;
	        buf[1] = r0 * 0.00079 + r1 * 0.13135 + r2 * -0.02904;
	        buf[2] = r0 * 0.00278 + r1 * 0.22721 + r2 * -0.01341;
	        buf[3] = r1 * 0.26740;
	        buf[4] = r0 * -0.01341 + r1 * 0.22721 + r2 * 0.00278;
	        buf[5] = r0 * -0.02904 + r1 * 0.13135 + r2 * 0.00079;
	        buf[6] = r0 * -0.02115 + r1 * 0.03420;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = {
	            r: r1 * 0.03420 + r2 * -0.02115,
	            i: i1 * 0.03420 + i2 * -0.02115
	        };
	        buf[1] = {
	            r: r0 * 0.00079 + r1 * 0.13135 + r2 * -0.02904,
	            i: i0 * 0.00079 + i1 * 0.13135 + i2 * -0.02904
	        };
	        buf[2] = {
	            r: r0 * 0.00278 + r1 * 0.22721 + r2 * -0.01341,
	            i: i0 * 0.00278 + i1 * 0.22721 + i2 * -0.01341
	        };
	        buf[3] = {
	            r: r1 * 0.26740,
	            i: i1 * 0.26740
	        };
	        buf[4] = {
	            r: r0 * -0.01341 + r1 * 0.22721 + r2 * 0.00278,
	            i: i0 * -0.01341 + i1 * 0.22721 + i2 * 0.00278
	        };
	        buf[5] = {
	            r: r0 * -0.02904 + r1 * 0.13135 + r2 * 0.00079,
	            i: i0 * -0.02904 + i1 * 0.13135 + i2 * 0.00079
	        };
	        buf[6] = {
	            r: r0 * -0.02115 + r1 * 0.03420,
	            i: i0 * -0.02115 + i1 * 0.03420
	        };
	    };
	}

	/**
	 * ### decimation : 11
	 */
	function Resampler11() {
	    var idx = 0;
	    var r0 = 0;
	    var i0 = 0;
	    var r1 = 0;
	    var i1 = 0;
	    var r2 = 0;
	    var i2 = 0;
	    var r3 = 0;
	    var i3 = 0;
	    var r4 = 0;
	    var i4 = 0;
	    var r5 = 0;
	    var i5 = 0;
	    var r6 = 0;
	    var i6 = 0;
	    var r7 = 0;
	    var i7 = 0;
	    var r8 = 0;
	    var i8 = 0;
	    var r9 = 0;
	    var i9 = 0;
	    var r10 = 0;
	    var i10 = 0;
	    var r11 = 0;
	    var i11 = 0;
	    var r12 = 0;
	    var i12 = 0;

	    this.decimate = function (v) {
	        r0 = r1;
	        r1 = r2;
	        r2 = r3;
	        r3 = r4;
	        r4 = r5;
	        r5 = r6;
	        r6 = r7;
	        r7 = r8;
	        r8 = r9;
	        r9 = r10;
	        r10 = r11;
	        r11 = r12;
	        r12 = v;
	        if (++idx >= 11) {
	            idx = 0;
	            return r1 * 0.01322 + r2 * 0.03922 + r3 * 0.07264 + r4 * 0.11402 + r5 * 0.14759 + r6 * 0.16043 + r7 * 0.14759 + r8 * 0.11402 + r9 * 0.07264 + r10 * 0.03922 + r11 * 0.01322;
	        } else {
	            return false;
	        }
	    };

	    this.decimatex = function (vr, vi) {
	        r0 = r1;
	        i0 = i1;
	        r1 = r2;
	        i1 = i2;
	        r2 = r3;
	        i2 = i3;
	        r3 = r4;
	        i3 = i4;
	        r4 = r5;
	        i4 = i5;
	        r5 = r6;
	        i5 = i6;
	        r6 = r7;
	        i6 = i7;
	        r7 = r8;
	        i7 = i8;
	        r8 = r9;
	        i8 = i9;
	        r9 = r10;
	        i9 = i10;
	        r10 = r11;
	        i10 = i11;
	        r11 = r12;
	        i11 = i12;
	        r12 = vr;
	        i12 = vi;
	        if (++idx >= 11) {
	            idx = 0;
	            return {
	                r: r1 * 0.01322 + r2 * 0.03922 + r3 * 0.07264 + r4 * 0.11402 + r5 * 0.14759 + r6 * 0.16043 + r7 * 0.14759 + r8 * 0.11402 + r9 * 0.07264 + r10 * 0.03922 + r11 * 0.01322,
	                i: i1 * 0.01322 + i2 * 0.03922 + i3 * 0.07264 + i4 * 0.11402 + i5 * 0.14759 + i6 * 0.16043 + i7 * 0.14759 + i8 * 0.11402 + i9 * 0.07264 + i10 * 0.03922 + i11 * 0.01322
	            };
	        } else {
	            return false;
	        }
	    };

	    this.interpolate = function (v, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = v;
	        buf[0] = r1 * 0.01307 + r2 * -0.00968;
	        buf[1] = r0 * 0.00014 + r1 * 0.04810 + r2 * -0.01924;
	        buf[2] = r0 * 0.00080 + r1 * 0.09012 + r2 * -0.01845;
	        buf[3] = r0 * 0.00176 + r1 * 0.13050 + r2 * -0.01213;
	        buf[4] = r0 * 0.00197 + r1 * 0.15972 + r2 * -0.00498;
	        buf[5] = r1 * 0.17038;
	        buf[6] = r0 * -0.00498 + r1 * 0.15972 + r2 * 0.00197;
	        buf[7] = r0 * -0.01213 + r1 * 0.13050 + r2 * 0.00176;
	        buf[8] = r0 * -0.01845 + r1 * 0.09012 + r2 * 0.00080;
	        buf[9] = r0 * -0.01924 + r1 * 0.04810 + r2 * 0.00014;
	        buf[10] = r0 * -0.00968 + r1 * 0.01307;
	    };

	    this.interpolatex = function (vr, vi, buf) {
	        r0 = r1;
	        r1 = r2;
	        r2 = vr;
	        i0 = i1;
	        i1 = i2;
	        i2 = vi;
	        buf[0] = {
	            r: r1 * 0.01307 + r2 * -0.00968,
	            i: i1 * 0.01307 + i2 * -0.00968
	        };
	        buf[1] = {
	            r: r0 * 0.00014 + r1 * 0.04810 + r2 * -0.01924,
	            i: i0 * 0.00014 + i1 * 0.04810 + i2 * -0.01924
	        };
	        buf[2] = {
	            r: r0 * 0.00080 + r1 * 0.09012 + r2 * -0.01845,
	            i: i0 * 0.00080 + i1 * 0.09012 + i2 * -0.01845
	        };
	        buf[3] = {
	            r: r0 * 0.00176 + r1 * 0.13050 + r2 * -0.01213,
	            i: i0 * 0.00176 + i1 * 0.13050 + i2 * -0.01213
	        };
	        buf[4] = {
	            r: r0 * 0.00197 + r1 * 0.15972 + r2 * -0.00498,
	            i: i0 * 0.00197 + i1 * 0.15972 + i2 * -0.00498
	        };
	        buf[5] = {
	            r: r1 * 0.17038,
	            i: i1 * 0.17038
	        };
	        buf[6] = {
	            r: r0 * -0.00498 + r1 * 0.15972 + r2 * 0.00197,
	            i: i0 * -0.00498 + i1 * 0.15972 + i2 * 0.00197
	        };
	        buf[7] = {
	            r: r0 * -0.01213 + r1 * 0.13050 + r2 * 0.00176,
	            i: i0 * -0.01213 + i1 * 0.13050 + i2 * 0.00176
	        };
	        buf[8] = {
	            r: r0 * -0.01845 + r1 * 0.09012 + r2 * 0.00080,
	            i: i0 * -0.01845 + i1 * 0.09012 + i2 * 0.00080
	        };
	        buf[9] = {
	            r: r0 * -0.01924 + r1 * 0.04810 + r2 * 0.00014,
	            i: i0 * -0.01924 + i1 * 0.04810 + i2 * 0.00014
	        };
	        buf[10] = {
	            r: r0 * -0.00968 + r1 * 0.01307,
	            i: i0 * -0.00968 + i1 * 0.01307
	        };
	    };
	}

	//######################################
	//## END GENERATED
	//######################################

	/**
	 * Exported factory for resamplers
	 */
	var Resampler = {

	    create: function create(decimation) {

	        function BadDecimationSpecException(message) {
	            this.message = message;
	            this.name = "BadDecimationSpecException";
	        }

	        switch (decimation) {
	            case 1:
	                return new Resampler1();
	            case 2:
	                return new Resampler2();
	            case 3:
	                return new Resampler3();
	            case 4:
	                return new Resampler4();
	            case 5:
	                return new Resampler5();
	            case 6:
	                return new Resampler6();
	            case 7:
	                return new Resampler7();
	            default:
	                throw new BadDecimationSpecException("Decimation " + decimation + " not supported");
	        }
	    }

	};

	exports.Resampler = Resampler;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Mode = undefined;

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _resample = __webpack_require__(19);

	var _nco = __webpack_require__(21);

	var _constants = __webpack_require__(6);

	var _filter = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */
	/* jslint node: true */

	var Mode = function () {
	    function Mode(par, props, sampleRateHint) {
	        (0, _classCallCheck3.default)(this, Mode);

	        this.par = par;
	        this.properties = props(this);
	        this._frequency = 1000;
	        this.decimation = Math.floor(par.getSampleRate() / sampleRateHint);
	        this.sampleRate = par.getSampleRate() / this.decimation;
	        this.afcFilter = _filter.Biquad.lowPass(1.0, 100.0);
	        this.loBin = 0;
	        this.freqBin = 0;
	        this.hiBin = 0;
	        this.adjustAfc();
	        this.afcFilter = _filter.Biquad.lowPass(1.0, 100.0);
	        this.useAfc = false;
	        this._rate = 31.25;
	        this.decimator = _resample.Resampler.create(this.decimation);
	        this.interpolator = _resample.Resampler.create(this.decimation);
	        this.nco = new _nco.Nco(this._frequency, par.getSampleRate());

	        //transmit
	        this.obuf = new Float32Array(this.decimation);
	        this.optr = 0;
	        this.ibuf = [];
	        this.ilen = 0;
	        this.iptr = 0;
	    }

	    (0, _createClass3.default)(Mode, [{
	        key: "adjustAfc",
	        value: function adjustAfc() {
	            var freq = this._frequency;
	            var fs = this.par.getSampleRate();
	            var bw = this.bandwidth;
	            var binWidth = fs * 0.5 / _constants.Constants.BINS;
	            this.loBin = (freq - bw * 0.707) / binWidth | 0;
	            this.freqBin = freq / binWidth | 0;
	            this.hiBin = (freq + bw * 0.707) / binWidth | 0;
	            //console.log("afc: " + loBin + "," + freqBin + "," + hiBin);
	        }
	    }, {
	        key: "computeAfc",
	        value: function computeAfc(ps) {
	            var sum = 0;
	            for (var i = loBin, j = hiBin; i < freqBin; i++, j--) {
	                if (ps[j] > ps[i]) sum++;else if (ps[i] > ps[j]) sum--;
	            }
	            var filtered = this.afcFilter.update(sum);
	            this.nco.setError(filtered);
	        }
	    }, {
	        key: "status",
	        value: function status(msg) {
	            this.par.status(this.properties.name + " : " + msg);
	        }
	    }, {
	        key: "receiveFft",

	        //#######################
	        //# R E C E I V E
	        //#######################

	        value: function receiveFft(ps) {
	            if (useAfc) {
	                this.computeAfc(ps);
	            }
	        }
	    }, {
	        key: "receiveData",
	        value: function receiveData(v) {
	            var cs = this.nco.next();
	            var cv = this.decimator.decimatex(v * cs.cos, -v * cs.sin);
	            if (cv !== false) {
	                this.receive(cv);
	            }
	        }

	        /**
	         * Overload this for each mode.  The parameter is either float or complex,
	         * depending on downmix()
	         */

	    }, {
	        key: "receive",
	        value: function receive(v) {}

	        //#######################
	        //# T R A N S M I T
	        //#######################

	    }, {
	        key: "getTransmitData",
	        value: function getTransmitData() {

	            //output buffer empty?
	            if (this.optr >= this.decimation) {
	                //input buffer empty?
	                if (this.iptr >= this.ilen) {
	                    this.ibuf = this.getBasebandData();
	                    this.ilen = this.ibuf.length;
	                    if (this.ilen === 0) {
	                        this.ilen = 1;
	                        this.ibuf = [0];
	                    }
	                    this.iptr = 0;
	                }
	                var v = this.ibuf[this.iptr++];
	                this.interpolator.interpolatex(v, this.interpbuf);
	                this.optr = 0;
	            }
	            var cx = this.obuf[this.optr];
	            var upmixed = this.nco.mixNext(cx);
	            return upmixed.abs();
	        }
	    }, {
	        key: "frequency",
	        set: function set(freq) {
	            this._frequency = freq;
	            this.nco.setFrequency(freq);
	            this.adjustAfc();
	        },
	        get: function get() {
	            return this._frequency;
	        }
	    }, {
	        key: "bandwidth",
	        get: function get() {
	            return 0;
	        }
	    }, {
	        key: "rate",
	        set: function set(v) {
	            this._rate = v;
	            this.adjustAfc();
	            this.status("Fs: " + this.sampleRate + " rate: " + v + " sps: " + this.samplesPerSymbol);
	        },
	        get: function get() {
	            return this._rate;
	        }
	    }, {
	        key: "samplesPerSymbol",
	        get: function get() {
	            return this.sampleRate / this._rate;
	        }
	    }]);
	    return Mode;
	}();

	exports.Mode = Mode;

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var ncoTable = function () {

	    var twopi = Math.PI * 2.0;
	    var two16 = 65536;
	    var delta = twopi / two16;

	    var xs = new Array(two16);

	    for (var idx = 0; idx < two16; idx++) {
	        var angle = delta * idx;
	        xs[idx] = { cos: Math.cos(angle), sin: Math.sin(angle) };
	    }
	    return xs;
	}();

	/**
	 * A sine generator with a 31-bit accumulator and a 16-bit
	 * lookup table.  Much faster than Math.whatever
	 */
	function Nco(frequency, sampleRate) {
	    "use strict";

	    var hzToInt = 0x7fffffff / sampleRate;
	    var freq = 0 | 0;

	    function setFrequency(frequency) {
	        freq = frequency * hzToInt | 0;
	    }

	    this.setFrequency = setFrequency;
	    setFrequency(frequency);

	    var err = 0;
	    var maxErr = 50 * hzToInt | 0; //in hertz
	    console.log("maxErr: " + maxErr);
	    var minErr = -(50 * hzToInt) | 0; //in hertz

	    function setError(v) {
	        err = err * 0.9 + v * 100000.0 | 0;
	        //console.log("err:" + err + "  v:" + v);
	        if (err > maxErr) err = maxErr;else if (err < minErr) err = minErr;
	    }

	    this.setError = setError;

	    var phase = 0 | 0;
	    var table = ncoTable;

	    this.next = function () {
	        phase = phase + (freq + err) & 0x7fffffff;
	        return table[phase >> 16 & 0xffff];
	    };

	    this.mixNext = function (v) {
	        phase = phase + (freq + err) & 0x7fffffff;
	        var cs = table[phase >> 16 & 0xffff];
	        return { r: v * cs.cos, i: -v * cs.sin };
	    };
	}

	exports.Nco = Nco;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Biquad = exports.FIR = undefined;

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _window = __webpack_require__(17);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Filter = function () {
	    function Filter() {
	        (0, _classCallCheck3.default)(this, Filter);
	    }

	    (0, _createClass3.default)(Filter, [{
	        key: 'update',
	        value: function update(v) {
	            return v;
	        }
	    }, {
	        key: 'updatex',
	        value: function updatex(v) {
	            return v;
	        }
	    }]);
	    return Filter;
	}();

	/**
	 * Hardcoded filter for size 13.  Pick 13!
	 */
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	function newFilter13(coeffs) {

	    var c0 = coeffs[0],
	        c1 = coeffs[1],
	        c2 = coeffs[2],
	        c3 = coeffs[3],
	        c4 = coeffs[4],
	        c5 = coeffs[5],
	        c6 = coeffs[6],
	        c7 = coeffs[7],
	        c8 = coeffs[8],
	        c9 = coeffs[9],
	        c10 = coeffs[10],
	        c11 = coeffs[11],
	        c12 = coeffs[12];

	    var r0 = 0,
	        r1 = 0,
	        r2 = 0,
	        r3 = 0,
	        r4 = 0,
	        r5 = 0,
	        r6 = 0,
	        r7 = 0,
	        r8 = 0,
	        r9 = 0,
	        r10 = 0,
	        r11 = 0,
	        r12 = 0;
	    var i0 = 0,
	        i1 = 0,
	        i2 = 0,
	        i3 = 0,
	        i4 = 0,
	        i5 = 0,
	        i6 = 0,
	        i7 = 0,
	        i8 = 0,
	        i9 = 0,
	        i10 = 0,
	        i11 = 0,
	        i12 = 0;

	    return {
	        update: function update(v) {
	            r12 = r11;
	            r11 = r10;
	            r10 = r9;
	            r9 = r8;
	            r8 = r7;
	            r7 = r6;
	            r6 = r5;
	            r5 = r4;
	            r4 = r3;
	            r3 = r2;
	            r2 = r1;
	            r1 = r0;
	            r0 = v;

	            return c0 * r12 + c1 * r11 + c2 * r10 + c3 * r9 + c4 * r8 + c5 * r7 + c6 * r6 + c7 * r5 + c8 * r4 + c9 * r3 + c10 * r2 + c11 * r1 + c12 * r0;
	        },

	        updatex: function updatex(v) {
	            r12 = r11;
	            r11 = r10;
	            r10 = r9;
	            r9 = r8;
	            r8 = r7;
	            r7 = r6;
	            r6 = r5;
	            r5 = r4;
	            r4 = r3;
	            r3 = r2;
	            r2 = r1;
	            r1 = r0;
	            r0 = v.r;
	            i12 = i11;
	            i11 = i10;
	            i10 = i9;
	            i9 = i8;
	            i8 = i7;
	            i7 = i6;
	            i6 = i5;
	            i5 = i4;
	            i4 = i3;
	            i3 = i2;
	            i2 = i1;
	            i1 = i0;
	            i0 = v.i;

	            return {
	                r: c0 * r12 + c1 * r11 + c2 * r10 + c3 * r9 + c4 * r8 + c5 * r7 + c6 * r6 + c7 * r5 + c8 * r4 + c9 * r3 + c10 * r2 + c11 * r1 + c12 * r0,
	                i: c0 * i12 + c1 * i11 + c2 * i10 + c3 * i9 + c4 * i8 + c5 * i7 + c6 * i6 + c7 * i5 + c8 * i4 + c9 * i3 + c10 * i2 + c11 * i1 + c12 * i0
	            };
	        }
	    };
	}

	var FIR = function () {

	    function genCoeffs(size, window, func) {
	        window = window || _window.Window.hann;
	        var W = window(size);
	        var center = size * 0.5;
	        var sum = 0.0;
	        var arr = [];
	        for (var i = 0; i < size; i++) {
	            var v = func(i - center) * W[i];
	            sum += v;
	            arr[arr.length] = v;
	        }
	        for (var j = 0; j < size; j++) {
	            arr[j] /= sum;
	            //console.log("coeff " + j + " : " + arr[j]);
	        }
	        return arr;
	    }

	    function newFilter(size, coeffs) {
	        var sizeless = size - 1;
	        var dlr = new Array(size);
	        var dli = new Array(size);
	        var dptr = 0;

	        var filter = {
	            update: function update(v) {
	                dlr[dptr++] = v;
	                dptr %= size;
	                var ptr = dptr;
	                var sum = 0;
	                for (var i = 0; i < size; i++) {
	                    sum += coeffs[i] * dlr[ptr];
	                    ptr = [ptr + sizeless] % size;
	                }
	                return sum;
	            },

	            updatex: function updatex(v) {
	                dlr[dptr] = v.r;
	                dli[dptr++] = v.i;
	                dptr %= size;
	                var ptr = dptr;
	                var sumr = 0;
	                var sumi = 0;
	                for (var i = 0; i < size; i++) {
	                    sumr += coeffs[i] * dlr[ptr];
	                    sumi += coeffs[i] * dli[ptr];
	                    ptr = [ptr + sizeless] % size;
	                }
	                return { r: sumr, i: sumi };
	            }
	        };
	        return filter;
	    }

	    var cls = {

	        average: function average(size, window) {
	            var omega = 1.0 / size;
	            var coeffs = genCoeffs(size, window, function (i) {
	                return omega;
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        },

	        boxcar: function boxcar(size, window) {
	            var coeffs = genCoeffs(size, window, function (i) {
	                return 1.0;
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        },

	        lowpass: function lowpass(size, cutoffFreq, sampleRate, window) {
	            var omega = 2.0 * Math.PI * cutoffFreq / sampleRate;
	            var coeffs = genCoeffs(size, window, function (i) {
	                return i === 0 ? omega / Math.PI : Math.sin(omega * i) / (Math.PI * i);
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        },

	        highpass: function highpass(size, cutoffFreq, sampleRate, window) {
	            var omega = 2.0 * Math.PI * cutoffFreq / sampleRate;
	            var coeffs = genCoeffs(size, window, function (i) {
	                return i === 0 ? 1.0 - omega / Math.PI : -Math.sin(omega * i) / (Math.PI * i);
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        },

	        bandpass: function bandpass(size, loCutoffFreq, hiCutoffFreq, sampleRate, window) {
	            var omega1 = 2.0 * Math.PI * hiCutoffFreq / sampleRate;
	            var omega2 = 2.0 * Math.PI * loCutoffFreq / sampleRate;
	            var coeffs = genCoeffs(size, window, function (i) {
	                return i === 0 ? (omega2 - omega1) / Math.PI : (Math.sin(omega2 * i) - Math.sin(omega1 * i)) / (Math.PI * i);
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        },

	        bandreject: function bandreject(size, loCutoffFreq, hiCutoffFreq, sampleRate, window) {
	            var omega1 = 2.0 * Math.PI * hiCutoffFreq / sampleRate;
	            var omega2 = 2.0 * Math.PI * loCutoffFreq / sampleRate;
	            var coeffs = genCoeffs(size, window, function (i) {
	                return i === 0 ? 1.0 - (omega2 - omega1) / Math.PI : (Math.sin(omega1 * i) - Math.sin(omega2 * i)) / (Math.PI * i);
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        },

	        raisedcosine: function raisedcosine(size, rolloff, symbolFreq, sampleRate, window) {
	            var T = sampleRate / symbolFreq;
	            var a = rolloff;

	            var coeffs = genCoeffs(size, window, function (i) {
	                var nT = i / T;
	                var anT = a * nT;
	                var c = 0;
	                if (i === 0) c = 1.0;else if (anT === 0.5 || anT === -0.5) //look at denominator below
	                    c = Math.sin(Math.PI * nT) / (Math.PI * nT) * Math.PI / 4.0;else c = Math.sin(Math.PI * nT) / (Math.PI * nT) * Math.cos(Math.PI * anT) / (1.0 - 4.0 * anT * anT);
	                return c;
	            });
	            return size === 13 ? newFilter13(coeffs) : newFilter(size, coeffs);
	        }

	    };

	    return cls;
	}();

	//########################################################################
	//#  B I Q U A D
	//########################################################################

	/**
	 * A biquad filter
	 * @see http://en.wikipedia.org/wiki/Digital_biquad_filter
	 */
	var Biquad = function () {

	    function Filter(b0, b1, b2, a1, a2) {

	        var x1 = 0,
	            x2 = 0,
	            y1 = 0,
	            y2 = 0;
	        var x1r = 0,
	            x2r = 0,
	            y1r = 0,
	            y2r = 0;
	        var x1i = 0,
	            x2i = 0,
	            y1i = 0,
	            y2i = 0;

	        this.update = function (x) {
	            var y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
	            x2 = x1;
	            x1 = x;
	            y2 = y1;
	            y1 = y;
	            return y;
	        };

	        this.updatex = function (x) {
	            var r = x.r;
	            var i = x.i;
	            var yr = b0 * r + b1 * x1r + b2 * x2r - a1 * y1r - a2 * y2r;
	            var yi = b0 * i + b1 * x1i + b2 * x2i - a1 * y1i - a2 * y2i;
	            x2r = x1r;
	            x1r = r;
	            x2i = x1i;
	            x1i = i;
	            y2r = y1r;
	            y1r = yr;
	            y2i = y1i;
	            y1i = yi;
	            return { r: yr, i: yi };
	        };
	    }

	    var cls = {
	        lowPass: function lowPass(frequency, sampleRate, q) {
	            q = typeof q !== 'undefined' ? q : 0.707;
	            var freq = 2.0 * Math.PI * frequency / sampleRate;
	            var alpha = Math.sin(freq) / (2.0 * q);
	            var b0 = (1.0 - Math.cos(freq)) / 2.0;
	            var b1 = 1.0 - Math.cos(freq);
	            var b2 = (1.0 - Math.cos(freq)) / 2.0;
	            var a0 = 1.0 + alpha;
	            var a1 = -2.0 * Math.cos(freq);
	            var a2 = 1.0 - alpha;
	            return new Filter(b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0);
	        },

	        highPass: function highPass(frequency, sampleRate, q) {
	            q = typeof q !== 'undefined' ? q : 0.707;
	            var freq = 2.0 * Math.PI * frequency / sampleRate;
	            var alpha = Math.sin(freq) / (2.0 * q);
	            var b0 = (1.0 + Math.cos(freq)) / 2.0;
	            var b1 = -(1.0 + Math.cos(freq));
	            var b2 = (1.0 + Math.cos(freq)) / 2.0;
	            var a0 = 1.0 + alpha;
	            var a1 = -2.0 * Math.cos(freq);
	            var a2 = 1.0 - alpha;
	            return new Filter(b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0);
	        },

	        bandPass: function bandPass(frequency, sampleRate, q) {
	            q = typeof q !== 'undefined' ? q : 0.5;
	            var freq = 2.0 * Math.PI * frequency / sampleRate;
	            var alpha = Math.sin(freq) / (2.0 * q);
	            var b0 = Math.sin(freq) / 2.0; // = q*alpha
	            var b1 = 0.0;
	            var b2 = -Math.sin(freq) / 2.0; // = -q*alpha
	            var a0 = 1.0 + alpha;
	            var a1 = -2.0 * Math.cos(freq);
	            var a2 = 1.0 - alpha;
	            return new Filter(b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0);
	        },

	        bandReject: function bandReject(frequency, sampleRate, q) {
	            q = typeof q !== 'undefined' ? q : 0.5;
	            var freq = 2.0 * Math.PI * frequency / sampleRate;
	            var alpha = Math.sin(freq) / (2.0 * q);
	            var b0 = 1.0;
	            var b1 = -2.0 * Math.cos(freq);
	            var b2 = 1.0;
	            var a0 = 1.0 + alpha;
	            var a1 = -2.0 * Math.cos(freq);
	            var a2 = 1.0 - alpha;
	            return new Filter(b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0);
	        }
	    };

	    return cls;
	}();

	exports.FIR = FIR;
	exports.Biquad = Biquad;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PskMode2 = exports.PskMode = undefined;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(31);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(59);

	var _get3 = _interopRequireDefault(_get2);

	var _set2 = __webpack_require__(63);

	var _set3 = _interopRequireDefault(_set2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(64);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _mode = __webpack_require__(20);

	var _filter = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * This contains the definitions of the bit patterns for the Varicode set
	 * of characters.
	 *
	 * A "from" and a "to" table are also provided.
	 */
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var Varicode = function () {

	    var description = ["1010101011", //  0  00  NUL Null character
	    "1011011011", //  1  01  SOH Start of Header
	    "1011101101", //  2  02  STX Start of Text
	    "1101110111", //  3  03  ETX End of Text
	    "1011101011", //  4  04  EOT End of Transmission
	    "1101011111", //  5  05  ENQ Enquiry
	    "1011101111", //  6  06  ACK Acknowledgment
	    "1011111101", //  7  07  BEL Bell
	    "1011111111", //  8  08  BS  Backspace
	    "11101111", //  9  09  HT  Horizontal Tab
	    "11101", // 10  0A  LF  Line feed
	    "1101101111", // 11  0B  VT  Vertical Tab
	    "1011011101", // 12  0C  FF  Form feed
	    "11111", // 13  0D  CR  Carriage return
	    "1101110101", // 14  0E  SO  Shift Out
	    "1110101011", // 15  0F  SI  Shift In
	    "1011110111", // 16  10  DLE Data Link Escape
	    "1011110101", // 17  11  DC1 Device Control 1 (XON)
	    "1110101101", // 18  12  DC2 Device Control 2
	    "1110101111", // 19  13  DC3 Device Control 3 (XOFF)
	    "1101011011", // 20  14  DC4 Device Control 4
	    "1101101011", // 21  15  NAK Negative Acknowledgement
	    "1101101101", // 22  16  SYN Synchronous Idle
	    "1101010111", // 23  17  ETB End of Trans. Block
	    "1101111011", // 24  18  CAN Cancel
	    "1101111101", // 25  19  EM  End of Medium
	    "1110110111", // 26  1A  SUB Substitute
	    "1101010101", // 27  1B  ESC Escape
	    "1101011101", // 28  1C  FS  File Separator
	    "1110111011", // 29  1D  GS  Group Separator
	    "1011111011", // 30  1E  RS  Record Separator
	    "1101111111", // 31  1F  US  Unit Separator
	    "1", // 32  20  SP
	    "111111111", // 33  21  !
	    "101011111", // 34  22  "
	    "111110101", // 35  23  #
	    "111011011", // 36  24  $
	    "1011010101", // 37  25  %
	    "1010111011", // 38  26  &
	    "101111111", // 39  27  '
	    "11111011", // 40  28  (
	    "11110111", // 41  29  )
	    "101101111", // 42  2A  *
	    "111011111", // 43  2B  +
	    "1110101", // 44  2C  ",
	    "110101", // 45  2D  -
	    "1010111", // 46  2E  .
	    "110101111", // 47  2F  /
	    "10110111", // 48  30  0
	    "10111101", // 49  31  1",  //
	    "11101101", // 50  32  2
	    "11111111", // 51  33  3
	    "101110111", // 52  34  4
	    "101011011", // 53  35  5
	    "101101011", // 54  36  6
	    "110101101", // 55  37  7
	    "110101011", // 56  38  8
	    "110110111", // 57  39  9
	    "11110101", // 58  3A  :
	    "110111101", // 59  3B  ;
	    "111101101", // 60  3C  <
	    "1010101", // 61  3D  =
	    "111010111", // 62  3E  >
	    "1010101111", // 63  3F  ?
	    "1010111101", // 64  40  @
	    "1111101", // 65  41  A
	    "11101011", // 66  42  B
	    "10101101", // 67  43  C
	    "10110101", // 68  44  D
	    "1110111", // 69  45  E
	    "11011011", // 70  46  F
	    "11111101", // 71  47  G
	    "101010101", // 72  48  H
	    "1111111", // 73  49  I
	    "111111101", // 74  4A  J
	    "101111101", // 75  4B  K
	    "11010111", // 76  4C  L
	    "10111011", // 77  4D  M
	    "11011101", // 78  4E  N
	    "10101011", // 79  4F  O
	    "11010101", // 80  50  P
	    "111011101", // 81  51  Q
	    "10101111", // 82  52  R
	    "1101111", // 83  53  S
	    "1101101", // 84  54  T
	    "101010111", // 85  55  U
	    "110110101", // 86  56  V
	    "101011101", // 87  57  W
	    "101110101", // 88  58  X
	    "101111011", // 89  59  Y
	    "1010101101", // 90  5A  Z
	    "111110111", // 91  5B  [
	    "111101111", // 92  5C  \
	    "111111011", // 93  5D  ]
	    "1010111111", // 94  5E  ^
	    "101101101", // 95  5F  _
	    "1011011111", // 96  60  `
	    "1011", // 97  61  a
	    "1011111", // 98  62  b
	    "101111", // 99  63  c
	    "101101", //100  64  d
	    "11", //101  65  e
	    "111101", //102  66  f
	    "1011011", //103  67  g
	    "101011", //104  68  h
	    "1101", //105  69  i
	    "111101011", //106  6A  j
	    "10111111", //107  6B  k
	    "11011", //108  6C  l
	    "111011", //109  6D  m
	    "1111", //110  6E  n
	    "111", //111  6F  o
	    "111111", //112  70  p
	    "110111111", //113  71  q
	    "10101", //114  72  r
	    "10111", //115  73  s
	    "101", //116  74  t
	    "110111", //117  75  u
	    "1111011", //118  76  v
	    "1101011", //119  77  w
	    "11011111", //120  78  x
	    "1011101", //121  79  y
	    "111010101", //122  7A  z
	    "1010110111", //123  7B  {
	    "110111011", //124  7C  |
	    "1010110101", //125  7D  }
	    "1011010111", //126  7E  ~
	    "1110110101" //127  7F  DEL  Delete
	    ];

	    var cls = {

	        /**
	         * this is a table of index->bit seqs.  Ex: 116('t') is Seq(true, false, true)
	         */
	        encodeTable: description.map(function (s) {
	            var chars = s.split("");
	            var bools = chars.map(function (c) {
	                return c === '1';
	            });
	            return bools;
	        }),

	        decodeTable: function () {
	            var dec = {};
	            for (var i = 0; i < description.length; i++) {
	                var key = parseInt(description[i], 2);
	                dec[key] = i;
	            }
	            return dec;
	        }(),

	        printTables: function printTables() {

	            console.log("Encode Table =================");
	            for (var i = 0; i < encodeTable.length; i++) {
	                console.log("" + i + " : " + encodeTable[i].join(","));
	            }
	            console.log("Decode Table =================");
	            for (var key in decodeTable) {
	                var asc = decodeTable[key];
	                console.log(key.toString(2) + " : " + asc);
	            }
	        }
	    }; //cls

	    return cls;
	}(); // Varicode

	function EarlyLate(samplesPerSymbol) {
	    var size = samplesPerSymbol | 0;
	    var half = size >> 1;
	    var buf = new Float32Array(size);
	    var bitclk = 0.0;

	    this.update = function (z, f) {
	        var idx = bitclk | 0;
	        var sum = 0.0;
	        var ampsum = 0.0;
	        var mag = z.mag();
	        buf[idx] = 0.8 * buf[idx] + 0.2 * mag;

	        for (var i = 0; i < half; i++) {
	            sum += buf[i] - buf[i + half];
	            ampsum += buf[i] + buf[i + half];
	        }

	        var err = ampsum === 0.0 ? 0.0 : sum / ampsum * 0.2;

	        bitclk += 1.0 - err;
	        if (bitclk < 0) bitclk += size;else if (bitclk >= size) {
	            bitclk -= size;
	            f(z);
	        }
	    };
	}

	var SSIZE = 200;
	var diffScale = 255.0 / Math.PI;
	var TWOPI = Math.PI * 2.0;
	var HALFPI = Math.PI * 0.5;

	/**
	 * Phase Shift Keying mode.
	 */

	var PskMode = function (_Mode) {
	    (0, _inherits3.default)(PskMode, _Mode);
	    (0, _createClass3.default)(PskMode, null, [{
	        key: "props",
	        value: function props(self) {
	            return {
	                name: "psk",
	                tooltip: "phase shift keying",
	                controls: [{
	                    name: "rate",
	                    type: "choice",
	                    tooltip: "PSK data rate",
	                    get value() {
	                        return self.rate;
	                    },
	                    set value(v) {
	                        self.rate = parseFloat(v);
	                    },
	                    values: [{ name: "31", value: 31.25 }, { name: "63", value: 62.50 }, { name: "125", value: 125.00 }]
	                }, {
	                    name: "qpsk",
	                    type: "boolean",
	                    tooltip: "not yet implemented",
	                    get value() {
	                        return self.qpskMode;
	                    },
	                    set value(v) {
	                        self.qpskMode = v;
	                    }
	                }]
	            };
	        }
	    }]);

	    function PskMode(par) {
	        (0, _classCallCheck3.default)(this, PskMode);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PskMode).call(this, par, PskMode.props, 2000));

	        _this.timer = new EarlyLate(_this.samplesPerSymbol);
	        _this.bpf = _filter.FIR.bandpass(13, -0.7 * _this.rate, 0.7 * _this.rate, _this.sampleRate);

	        _this.scopedata = new Array(SSIZE);
	        _this.sctr = 0;
	        _this.qpskMode = false;

	        //decoding
	        _this.code = 0;
	        _this.lastv = 0.0;
	        _this.count = 0;
	        _this.lastBit = false;

	        //transmit
	        _this.txBuf = [];
	        _this.txPtr = 0;

	        return _this;
	    }

	    (0, _createClass3.default)(PskMode, [{
	        key: "receive",
	        value: function receive(v) {
	            var _this2 = this;

	            var z = bpf.updatex(v);
	            this.scopeOut(z);
	            this.timer.update(z, function (vv) {
	                return _this2.processSymbol(vv);
	            });
	        }
	    }, {
	        key: "scopeOut",
	        value: function scopeOut(z) {
	            this.scopedata[this.sctr++] = [log(z.r + 1) * 30, log(z.i + 1) * 30];
	            if (this.sctr >= SSIZE) {
	                this.par.showScope(this.scopedata);
	                this.sctr = 0;
	                this.scopedata = new Array(SSIZE);
	            }
	        }
	    }, {
	        key: "angleDiff",
	        value: function angleDiff(a, b) {
	            var diff = a - b;
	            while (diff > Math.PI) {
	                diff -= TWOPI;
	            }while (diff < -Math.PI) {
	                diff += TWOPI;
	            } //println("%f %f %f".format(a, b, diff))
	            return diff;
	        }

	        /**
	         * Return the scaled distance of the angle v from "from".
	         * Returns a positive value 0..255  for
	         * 0 radians to +- pi
	         */

	    }, {
	        key: "distance",
	        value: function distance(v, from) {
	            var diff = Math.PI - Math.abs(Math.abs(v - from) - Math.PI);
	            return Math.floor(diff * diffScale);
	        }
	    }, {
	        key: "processSymbol",
	        value: function processSymbol(v) {

	            var vn, dv, d00, d01, d10, d11;

	            if (this.qpskMode) {
	                /**/
	                vn = v.arg();
	                dv = this.angleDiff(vn, this.lastv);
	                d00 = this.distance(dv, Math.PI);
	                d01 = this.distance(dv, halfpi);
	                d10 = this.distance(dv, -halfpi);
	                d11 = this.distance(dv, 0.0);
	                var bm = [d00, d01, d10, d11];
	                //println("%6.3f %6.3f %6.3f  :  %3d %3d %3d %3d".format(lastv, vn, dv, d00, d01, d10, d11))
	                var bits = this.decoder.decodeOne(bm);
	                var len = bits.length;
	                for (var i = 0; i < len; i++) {
	                    this.processBit(bits[i]);
	                }this.lastv = vn;
	                /**/
	            } else {
	                    //bpsk
	                    /**/
	                    vn = v.arg();
	                    dv = this.angleDiff(vn, this.lastv);
	                    d00 = this.distance(dv, Math.PI);
	                    d11 = this.distance(dv, 0.0);
	                    //println("%6.3f %6.3f %6.3f  :  %3d %3d".format(lastv, vn, dv, d00, d11))
	                    var bit = d11 < d00;
	                    this.lastv = vn;
	                    /**/
	                    this.processBit(bit);
	                }
	        }
	    }, {
	        key: "processBit",
	        value: function processBit(bit) {
	            //println("bit: " + bit)
	            if (!bit && !this.lastBit) {
	                this.code >>= 1; //remove trailing 0
	                if (this.code !== 0) {
	                    //println("code:" + Varicode.toString(code))
	                    var ascii = Varicode.decodeTable[code];
	                    if (ascii) {
	                        var chr = ascii;
	                        if (chr == 10 || chr == 13) this.par.puttext("\n");else this.par.puttext(String.fromCharCode(chr));
	                        this.code = 0;
	                    }
	                }
	                this.code = 0;
	            } else {
	                this.code <<= 1;
	                if (bit) this.code += 1;
	            }
	            this.lastBit = bit;
	        }

	        //###################
	        //# transmit
	        //###################

	    }, {
	        key: "getNextTransmitBuffer",
	        value: function getNextTransmitBuffer() {
	            var ch = par.gettext();
	            if (tx < 0) {} else {}
	        }
	    }, {
	        key: "transmit",
	        value: function transmit() {

	            if (this.txPtr >= this.txBuf.length) {
	                this.txBuf = getNextTransmitBuffer();
	                this.txPtr = 0;
	            }
	            var txv = this.txBuf[tthis.xPtr++];
	            return txv;
	        }
	    }, {
	        key: "rate",
	        set: function set(v) {
	            (0, _set3.default)((0, _getPrototypeOf2.default)(PskMode.prototype), "rate", v, this);
	            this.timer = new EarlyLate(this.samplesPerSymbol);
	            this.bpf = _filter.FIR.bandpass(13, -0.7 * v, 0.7 * v, this.sampleRate);
	        },
	        get: function get() {
	            return (0, _get3.default)((0, _getPrototypeOf2.default)(PskMode.prototype), "rate", this);
	        }
	    }, {
	        key: "bandwidth",
	        get: function get() {
	            return this.rate;
	        }
	    }]);
	    return PskMode;
	}(_mode.Mode); // PskMode

	/**
	 * Phase Shift Keying mode.
	 */

	var PskMode2 = function (_Mode2) {
	    (0, _inherits3.default)(PskMode2, _Mode2);
	    (0, _createClass3.default)(PskMode2, null, [{
	        key: "props",
	        value: function props(self) {
	            return {
	                name: "psk",
	                tooltip: "phase shift keying",
	                controls: [{
	                    name: "rate",
	                    type: "choice",
	                    get value() {
	                        return self.rate;
	                    },
	                    set value(v) {
	                        self.rate = parseFloat(v);
	                    },
	                    values: [{ name: "31", value: 31.25 }, { name: "63", value: 62.50 }, { name: "125", value: 125.00 }]
	                }, {
	                    name: "qpsk",
	                    type: "boolean",
	                    get value() {
	                        return self.qpskMode;
	                    },
	                    set value(v) {
	                        self.qpskMode = v;
	                    }
	                }]
	            };
	        }
	    }]);

	    function PskMode2(par) {
	        (0, _classCallCheck3.default)(this, PskMode2);

	        var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PskMode2).call(this, par, PskMode2.props, 1000));

	        _this3.ilp = null;
	        _this3.qlp = null;
	        _this3.symbollen = 0;
	        _this3.halfSym = 0;

	        //receive
	        _this3.lastSign = -1;
	        _this3.samples = 0;

	        //scope
	        _this3.scopedata = new Array(SSIZE);
	        _this3.sctr = 0;
	        _this3.log = Math.log;
	        _this3.ssctr = 0;

	        _this3.qpskMode = false;

	        _this3.code = 0;
	        _this3.lastv = 0.0;
	        _this3.count = 0;
	        _this3.lastBit = false;

	        //transmit
	        _this3.txBuf = [];
	        _this3.txPtr = 0;

	        _this3.rate = 31.25;
	        return _this3;
	    }

	    (0, _createClass3.default)(PskMode2, [{
	        key: "receive",
	        value: function receive(z) {
	            var i = this.ilp.update(z.r);
	            var q = this.qlp.update(z.i);
	            this.scopeOut(i, q);
	            var sign = i > 0 ? 1 : -1; //Math.sign() not on Chrome
	            if (sign != this.lastSign) {
	                this.samples = 0;
	            } else {
	                this.samples++;
	            }
	            if (this.samples % this.symbollen === this.halfSym) {
	                processSymbol(i, q);
	                //processBit(sign>0);
	            }
	            this.lastSign = sign;
	        }
	    }, {
	        key: "scopeOut",
	        value: function scopeOut(i, q) {
	            if (!(++ssctr & 1)) return; //skip items
	            this.scopedata[this.sctr++] = [log(i + 1) * 30.0, log(q + 1) * 30.0];
	            if (this.sctr >= SSIZE) {
	                this.par.showScope(this.scopedata);
	                this.sctr = 0;
	                this.scopedata = new Array(SSIZE);
	            }
	        }
	    }, {
	        key: "angleDiff",
	        value: function angleDiff(a, b) {
	            var diff = a - b;
	            while (diff > Math.PI) {
	                diff -= TWOPI;
	            }while (diff < -Math.PI) {
	                diff += TWOPI;
	            } //println("%f %f %f".format(a, b, diff))
	            return diff;
	        }

	        /**
	         * Return the scaled distance of the angle v from "from".
	         * Returns a positive value 0..255  for
	         * 0 radians to +- pi
	         */

	    }, {
	        key: "distance",
	        value: function distance(v, from) {
	            var diff = Math.PI - Math.abs(Math.abs(v - from) - Math.PI);
	            return Math.floor(diff * diffScale);
	        }
	    }, {
	        key: "processSymbol",
	        value: function processSymbol(i, q) {

	            var dv = undefined,
	                d00 = undefined,
	                d01 = undefined,
	                d10 = undefined,
	                d11 = undefined;

	            var vn = Math.atan2(q, i);

	            if (this.qpskMode) {
	                /**/
	                dv = this.angleDiff(vn, lastv);
	                d00 = this.distance(dv, Math.PI);
	                d01 = this.distance(dv, halfpi);
	                d10 = this.distance(dv, -halfpi);
	                d11 = this.distance(dv, 0.0);
	                var bm = [d00, d01, d10, d11];
	                //println("%6.3f %6.3f %6.3f  :  %3d %3d %3d %3d".format(lastv, vn, dv, d00, d01, d10, d11))
	                var bits = this.decoder.decodeOne(bm);
	                var len = bits.length;
	                for (var idx = 0; idx < len; idx++) {
	                    this.processBit(bits[idx]);
	                }this.lastv = vn;
	                /**/
	            } else {
	                    //bpsk
	                    /**/
	                    dv = this.angleDiff(vn, this.lastv);
	                    d00 = this.distance(dv, Math.PI);
	                    d11 = this.distance(dv, 0.0);
	                    //println("%6.3f %6.3f %6.3f  :  %3d %3d".format(lastv, vn, dv, d00, d11))
	                    var bit = d11 < d00;
	                    this.lastv = vn;
	                    /**/
	                    this.processBit(bit);
	                }
	        }
	    }, {
	        key: "processBit",
	        value: function processBit(bit) {
	            //println("bit: " + bit)
	            if (!bit && !this.lastBit) {
	                this.code >>= 1; //remove trailing 0
	                if (this.code !== 0) {
	                    //println("code:" + Varicode.toString(code))
	                    var ascii = Varicode.decodeTable[code];
	                    if (ascii) {
	                        var chr = ascii;
	                        if (chr == 10 || chr == 13) par.puttext("\n");else par.puttext(String.fromCharCode(chr));
	                        this.code = 0;
	                    }
	                }
	                this.code = 0;
	            } else {
	                this.code <<= 1;
	                if (bit) this.code += 1;
	            }
	            this.lastBit = bit;
	        }

	        //###################
	        //# transmit
	        //###################

	    }, {
	        key: "getNextTransmitBuffer",
	        value: function getNextTransmitBuffer() {
	            var ch = this.par.gettext();
	            if (tx < 0) {} else {}
	        }
	    }, {
	        key: "transmit",
	        value: function transmit() {

	            if (this.txPtr >= this.txBuf.length) {
	                this.txBuf = getNextTransmitBuffer();
	                this.txPtr = 0;
	            }
	            var txv = this.txBuf[this.txPtr++];
	            return txv;
	        }
	    }, {
	        key: "bandwidth",
	        get: function get() {
	            return this.rate;
	        }
	    }, {
	        key: "rate",
	        set: function set(v) {
	            (0, _set3.default)((0, _getPrototypeOf2.default)(PskMode2.prototype), "rate", v, this);
	            this.ilp = _filter.Biquad.lowPass(v * 0.5, this.sampleRate);
	            this.qlp = _filter.Biquad.lowPass(v * 0.5, this.sampleRate);
	            //bpf = FIR.bandpass(13, -0.7*this.getRate(), 0.7*this.getRate(), this.getSampleRate());
	            this.symbollen = this.samplesPerSymbol | 0;
	            this.halfSym = this.symbollen >> 1;
	        },
	        get: function get() {
	            return (0, _get3.default)((0, _getPrototypeOf2.default)(PskMode2.prototype), "rate", this);
	        }
	    }]);
	    return PskMode2;
	}(_mode.Mode); // PskMode2

	exports.PskMode = PskMode;
	exports.PskMode2 = PskMode2;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(25), __esModule: true };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(26);
	module.exports = __webpack_require__(14).Object.getPrototypeOf;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(27);

	__webpack_require__(29)('getPrototypeOf', function ($getPrototypeOf) {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function (it) {
	  return Object(defined(it));
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(12),
	    core = __webpack_require__(14),
	    fails = __webpack_require__(30);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY],
	      exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () {
	    fn(1);
	  }), 'Object', exp);
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(32);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof3 = __webpack_require__(32);

	var _typeof4 = _interopRequireDefault2(_typeof3);

	function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.__esModule = true;

	var _symbol = __webpack_require__(33);

	var _symbol2 = _interopRequireDefault(_symbol);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _typeof(obj) {
	  return obj && typeof _Symbol !== "undefined" && obj.constructor === _Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : (0, _typeof4.default)(obj);
	}

	exports.default = function (obj) {
	  return obj && typeof _symbol2.default !== "undefined" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(34), __esModule: true };

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(35);
	__webpack_require__(58);
	module.exports = __webpack_require__(14).Symbol;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim

	var _typeof2 = __webpack_require__(32);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var $ = __webpack_require__(5),
	    global = __webpack_require__(13),
	    has = __webpack_require__(36),
	    DESCRIPTORS = __webpack_require__(37),
	    $export = __webpack_require__(12),
	    redefine = __webpack_require__(38),
	    $fails = __webpack_require__(30),
	    shared = __webpack_require__(41),
	    setToStringTag = __webpack_require__(42),
	    uid = __webpack_require__(44),
	    wks = __webpack_require__(43),
	    keyOf = __webpack_require__(45),
	    $names = __webpack_require__(49),
	    enumKeys = __webpack_require__(53),
	    isArray = __webpack_require__(54),
	    anObject = __webpack_require__(55),
	    toIObject = __webpack_require__(46),
	    createDesc = __webpack_require__(40),
	    getDesc = $.getDesc,
	    setDesc = $.setDesc,
	    _create = $.create,
	    getNames = $names.get,
	    $Symbol = global.Symbol,
	    $JSON = global.JSON,
	    _stringify = $JSON && $JSON.stringify,
	    setter = false,
	    HIDDEN = wks('_hidden'),
	    isEnum = $.isEnum,
	    SymbolRegistry = shared('symbol-registry'),
	    AllSymbols = shared('symbols'),
	    useNative = typeof $Symbol == 'function',
	    ObjectProto = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(setDesc({}, 'a', {
	    get: function get() {
	      return setDesc(this, 'a', { value: 7 }).a;
	    }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = getDesc(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  setDesc(it, key, D);
	  if (protoDesc && it !== ObjectProto) setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function wrap(tag) {
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function set(value) {
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function isSymbol(it) {
	  return (typeof it === 'undefined' ? 'undefined' : (0, _typeof3.default)(it)) == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (D && has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    }return setSymbolDesc(it, key, D);
	  }return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P)),
	      i = 0,
	      l = keys.length,
	      key;
	  while (l > i) {
	    $defineProperty(it, key = keys[i++], P[key]);
	  }return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  var D = getDesc(it = toIObject(it), key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = getNames(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN) result.push(key);
	  }return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var names = getNames(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++])) result.push(AllSymbols[key]);
	  }return result;
	};
	var $stringify = function stringify(it) {
	  if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	  var args = [it],
	      i = 1,
	      $$ = arguments,
	      replacer,
	      $replacer;
	  while ($$.length > i) {
	    args.push($$[i++]);
	  }replacer = args[1];
	  if (typeof replacer == 'function') $replacer = replacer;
	  if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
	    if ($replacer) value = $replacer.call(this, key, value);
	    if (!isSymbol(value)) return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if (!useNative) {
	  $Symbol = function _Symbol() {
	    if (isSymbol(this)) throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString() {
	    return this._k;
	  });

	  isSymbol = function isSymbol(it) {
	    return it instanceof $Symbol;
	  };

	  $.create = $create;
	  $.isEnum = $propertyIsEnumerable;
	  $.getDesc = $getOwnPropertyDescriptor;
	  $.setDesc = $defineProperty;
	  $.setDescs = $defineProperties;
	  $.getNames = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(57)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function _for(key) {
	    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key) {
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function useSetter() {
	    setter = true;
	  },
	  useSimple: function useSimple() {
	    setter = false;
	  }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call(('hasInstance,isConcatSpreadable,iterator,match,replace,search,' + 'species,split,toPrimitive,toStringTag,unscopables').split(','), function (it) {
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, { Symbol: $Symbol });

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', { stringify: $stringify });

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(30)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(39);

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(5),
	    createDesc = __webpack_require__(40);
	module.exports = __webpack_require__(37) ? function (object, key, value) {
	  return $.setDesc(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(13),
	    SHARED = '__core-js_shared__',
	    store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var def = __webpack_require__(5).setDesc,
	    has = __webpack_require__(36),
	    TAG = __webpack_require__(43)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var store = __webpack_require__(41)('wks'),
	    uid = __webpack_require__(44),
	    _Symbol = __webpack_require__(13).Symbol;
	module.exports = function (name) {
	  return store[name] || (store[name] = _Symbol && _Symbol[name] || (_Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	var id = 0,
	    px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(5),
	    toIObject = __webpack_require__(46);
	module.exports = function (object, el) {
	  var O = toIObject(object),
	      keys = $.getKeys(O),
	      length = keys.length,
	      index = 0,
	      key;
	  while (length > index) {
	    if (O[key = keys[index++]] === el) return key;
	  }
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(47),
	    defined = __webpack_require__(28);
	module.exports = function (it) {
	  return IObject(defined(it));
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(48);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	"use strict";

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getOwnPropertyNames = __webpack_require__(50);

	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

	var _typeof2 = __webpack_require__(32);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(46),
	    getNames = __webpack_require__(5).getNames,
	    toString = {}.toString;

	var windowNames = (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) == 'object' && _getOwnPropertyNames2.default ? (0, _getOwnPropertyNames2.default)(window) : [];

	var getWindowNames = function getWindowNames(it) {
	  try {
	    return getNames(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it) {
	  if (windowNames && toString.call(it) == '[object Window]') return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(51), __esModule: true };

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(5);
	__webpack_require__(52);
	module.exports = function getOwnPropertyNames(it) {
	  return $.getNames(it);
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(29)('getOwnPropertyNames', function () {
	  return __webpack_require__(49).get;
	});

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(5);
	module.exports = function (it) {
	  var keys = $.getKeys(it),
	      getSymbols = $.getSymbols;
	  if (getSymbols) {
	    var symbols = getSymbols(it),
	        isEnum = $.isEnum,
	        i = 0,
	        key;
	    while (symbols.length > i) {
	      if (isEnum.call(it, key = symbols[i++])) keys.push(key);
	    }
	  }
	  return keys;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(48);
	module.exports = Array.isArray || function (arg) {
	  return cof(arg) == 'Array';
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(56);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = __webpack_require__(32);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : (0, _typeof3.default)(it)) === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	"use strict";

	module.exports = true;

/***/ },
/* 58 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(60);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(61), __esModule: true };

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(5);
	__webpack_require__(62);
	module.exports = function getOwnPropertyDescriptor(it, key) {
	  return $.getDesc(it, key);
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(46);

	__webpack_require__(29)('getOwnPropertyDescriptor', function ($getOwnPropertyDescriptor) {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(60);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = function set(object, property, value, receiver) {
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);

	    if (parent !== null) {
	      set(parent, property, value, receiver);
	    }
	  } else if ("value" in desc && desc.writable) {
	    desc.value = value;
	  } else {
	    var setter = desc.set;

	    if (setter !== undefined) {
	      setter.call(receiver, value);
	    }
	  }

	  return value;
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(65);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(69);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(32);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(67);
	module.exports = __webpack_require__(14).Object.setPrototypeOf;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(12);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(68).set });

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _setPrototypeOf = __webpack_require__(65);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc = __webpack_require__(5).getDesc,
	    isObject = __webpack_require__(56),
	    anObject = __webpack_require__(55);
	var check = function check(O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: _setPrototypeOf2.default || ('__proto__' in {} ? // eslint-disable-line
	  function (test, buggy, set) {
	    try {
	      set = __webpack_require__(15)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	      set(test, []);
	      buggy = !(test instanceof Array);
	    } catch (e) {
	      buggy = true;
	    }
	    return function setPrototypeOf(O, proto) {
	      check(O, proto);
	      if (buggy) O.__proto__ = proto;else set(O, proto);
	      return O;
	    };
	  }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(5);
	module.exports = function create(P, D) {
	  return $.create(P, D);
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.RttyMode = undefined;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(31);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _set2 = __webpack_require__(63);

	var _set3 = _interopRequireDefault(_set2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(64);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _fsk = __webpack_require__(72);

	var _filter = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * These are the ITU codes for 5-bit Baudot code and 7-bit SITOR
	 * in the same table
	 */
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var Baudot = {

	    t: [[0, 0], // 0x00 NUL
	    ['E', '3'], // 0x01
	    ['\n', '\n'], // 0x02 LF
	    ['A', '-'], // 0x03
	    [' ', ' '], // 0x04 SPACE
	    ['S', '\''], // 0x05
	    ['I', '8'], // 0x06
	    ['U', '7'], // 0x07
	    ['\n', '\n'], // 0x08 CR
	    ['D', '$'], // 0x09
	    ['R', '4'], // 0x0a
	    ['J', 7], // 0x0b 7=bell
	    ['N', ','], // 0x0c
	    ['F', '!'], // 0x0d
	    ['C', ':'], // 0x0e
	    ['K', '['], // 0x0f
	    ['T', '5'], // 0x10
	    ['Z', '+'], // 0x11
	    ['L', ']'], // 0x12
	    ['W', '2'], // 0x13
	    ['H', '#'], // 0x14
	    ['Y', '6'], // 0x15
	    ['P', '0'], // 0x16
	    ['Q', '1'], // 0x17
	    ['O', '9'], // 0x18
	    ['B', '?'], // 0x19
	    ['G', '&'], // 0x1a
	    [0, 0], // 0x1b FIGS
	    ['M', '.'], // 0x1c
	    ['X', '/'], // 0x1d
	    ['V', '='], // 0x1e
	    [0, 0] // 0x1f LTRS
	    ],
	    NUL: 0x00,
	    SPACE: 0x04,
	    CR: 0x08,
	    LF: 0x02,
	    LTRS: 0x1f,
	    FIGS: 0x1b
	};

	var NRBITS = 5;

	/**
	 * Enumerations for parity types
	 */
	var ParityNone = 0;
	var ParityOne = 1;
	var ParityZero = 2;
	var ParityOdd = 3;
	var ParityEven = 4;

	var RxIdle = 0;
	var RxStart = 1;
	var RxData = 2;
	var RxStop = 3;
	var RxParity = 4;

	/**
	 * Mode for Radio teletype.  Sends a standard
	 * async code with a start bit, 5 data bits and
	 * a stop bit.  Whether a parity bit is sent or
	 * interpreted should be adjustable.
	 *
	 * @see http://en.wikipedia.org/wiki/Radioteletype
	 * @see http://en.wikipedia.org/wiki/Asynchronous_serial_communication
	 *
	 */

	var RttyMode = function (_FskBase) {
	    (0, _inherits3.default)(RttyMode, _FskBase);
	    (0, _createClass3.default)(RttyMode, null, [{
	        key: "props",
	        value: function props(self) {
	            return {
	                name: "rtty",
	                tooltip: "radio teletype",
	                controls: [{
	                    name: "rate",
	                    type: "choice",
	                    tooltip: "rtty baud rate",
	                    get value() {
	                        return self.rate;
	                    },
	                    set value(v) {
	                        self.rate = parseFloat(v);
	                    },
	                    values: [{ name: "45", value: 45.45 }, { name: "50", value: 50.00 }, { name: "75", value: 75.00 }, { name: "100", value: 100.00 }]
	                }, {
	                    name: "shift",
	                    type: "choice",
	                    tooltip: "frequency distance between mark and space",
	                    get value() {
	                        return self.shift;
	                    },
	                    set value(v) {
	                        self.shift = parseFloat(v);
	                    },
	                    values: [{ name: "85", value: 85.0 }, { name: "170", value: 170.0 }, { name: "450", value: 450.0 }, { name: "850", value: 850.0 }]
	                }, {
	                    name: "inv",
	                    type: "boolean",
	                    get value() {
	                        return self.inverted;
	                    },
	                    set value(v) {
	                        self.inverted = v;
	                    }
	                }, {
	                    name: "UoS",
	                    type: "boolean",
	                    get value() {
	                        return self.unshiftOnSpace;
	                    },
	                    set value(v) {
	                        self.unshiftOnSpace = v;
	                    }
	                }]
	            };
	        }
	    }]);

	    function RttyMode(par) {
	        (0, _classCallCheck3.default)(this, RttyMode);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RttyMode).call(this, par, RttyMode.props, 1000.0));

	        _this.unshiftOnSpace = false;
	        _this.symbollen = 0;
	        _this.halfsym = 0;
	        _this.symarray = 0;
	        _this.symptr = 0;
	        _this.rate = 45.45;
	        _this.parityType = ParityNone;
	        _this.state = RxIdle;
	        _this.bitcount = 0;
	        _this.code = 0;
	        _this.parityBit = false;
	        _this.counter = 0;
	        _this.msbit = 1 << NRBITS - 1;
	        _this.shifted = false;
	        return _this;
	    }

	    (0, _createClass3.default)(RttyMode, [{
	        key: "setRate",
	        value: function setRate(v) {
	            (0, _set3.default)((0, _getPrototypeOf2.default)(RttyMode.prototype), "rate", v, this);
	            this.symbollen = Math.round(this.samplesPerSymbol);
	            this.halfsym = this.symbollen >> 1;
	            this.symarray = new Array(this.symbollen);
	            for (var _pp = 0; _pp < this.symbollen; _pp++) {
	                this.symarray[_pp] = false;
	            }
	        }
	    }, {
	        key: "parityOf",
	        value: function parityOf(c) {
	            switch (this.parityType) {
	                case ParityOdd:
	                    return (countbits(c) & 1) !== 0;
	                case ParityEven:
	                    return (countbits(c) & 1) === 0;
	                case ParityZero:
	                    return false;
	                case ParityOne:
	                    return true;
	                default:
	                    return false; //None or unknown
	            }
	        }

	        /**
	         * We wish to sample data at the end of a symbol period, with
	         * Use a cirsular delay line to check if we have a mark-to-space transition,
	         * then get a correction so that we align on symbol centers.  Once we do that,
	         * we are hopefully aligned on a trailing edge, then we can sense a mark or
	         * space by which has the most bits.
	         *
	         * |<-----symbollen ---->| Now
	         *
	         * ----3----|
	         *          |
	         *          |-----3------
	         *
	         *          |<---corr-->|
	         *
	         *
	         *
	         * While reading bits, are most of the bits set? Then it's
	         * a mark, else a space.
	         *
	         * |<-----symbollen ---->| Now
	         *  |------------------|
	         *  |                  |
	         * -|                  |-
	         *
	         */

	    }, {
	        key: "processBit",
	        value: function processBit(bit) {

	            symarray[symptr++] = bit;
	            symptr %= symbollen;
	            this.last = symarray[symptr];
	            this.isMarkToSpace = false;
	            this.corr = 0;
	            this.ptr = symptr;
	            this.sum = 0;
	            for (this.pp = 0; pp < symbollen; pp++) {
	                sum += symarray[ptr++];
	                ptr %= symbollen;
	            }
	            this.isMark = sum > halfsym;
	            if (last && !bit) {
	                if (Math.abs(halfsym - sum) < 6) {
	                    isMarkToSpace = true;
	                    corr = sum;
	                }
	            }

	            switch (state) {

	                case RxIdle:
	                    //console.log("RxIdle");
	                    if (isMarkToSpace) {
	                        state = RxStart;
	                        counter = corr; //lets us re-center
	                    }
	                    break;
	                case RxStart:
	                    //console.log("RxStart");
	                    if (--counter <= 0) {
	                        if (!isMark) {
	                            state = RxData;
	                            code = 0 | 0;
	                            parityBit = false;
	                            bitcount = 0;
	                            counter = symbollen;
	                        } else {
	                            state = RxIdle;
	                        }
	                    }
	                    break;
	                case RxData:
	                    //console.log("RxData");
	                    if (--counter <= 0) {
	                        counter = symbollen;
	                        //code = (code<<1) + isMark; //msb
	                        code = (code >>> 1) + (isMark ? msbit : 0) | 0; //lsb
	                        if (++bitcount >= NRBITS) {
	                            state = parityType === ParityNone ? RxStop : RxParity;
	                        }
	                    }
	                    break;
	                case RxParity:
	                    //console.log("RxParity");
	                    if (--counter <= 0) {
	                        state = RxStop;
	                        parityBit = isMark;
	                    }
	                    break;
	                case RxStop:
	                    //console.log("RxStop");
	                    if (--counter <= 0) {
	                        if (isMark) {
	                            outCode(code);
	                        }
	                        state = RxIdle;
	                    }
	                    break;
	            }
	        } // processBit

	    }, {
	        key: "reverse",
	        value: function reverse(v, size) {
	            var a = v;
	            var b = 0;
	            while (size--) {
	                b += a & 1;
	                b <<= 1;
	                a >>= 1;
	            }
	            return b;
	        }
	    }, {
	        key: "outCode",
	        value: function outCode(rawcode) {
	            //println("raw:" + rawcode)
	            //rawcode = reverse(rawcode, 5);
	            this.code = rawcode & 0x1f;
	            if (code === Baudot.NUL) {} else if (code === Baudot.FIGS) {
	                this.shifted = true;
	            } else if (code === Baudot.LTRS) {
	                this.shifted = false;
	            } else if (code === Baudot.SPACE) {
	                this.par.puttext(" ");
	                if (this.unshiftOnSpace) this.shifted = false;
	            } else if (code === Baudot.CR || code === Baudot.LF) {
	                this.par.puttext("\n");
	                if (this.unshiftOnSpace) this.shifted = false;
	            } else {
	                this.v = Baudot.t[code];
	                if (v) {
	                    this.c = this.shifted ? v[1] : v[0];
	                    if (c !== 0) this.par.puttext(c);
	                }
	            }
	        }

	        //################################################
	        //# T R A N S M I T
	        //################################################
	        /*
	         this.txShifted = false;
	         function txencode(str) {
	         this.buf = [];
	         this.chars = str.split("");
	         this.len = chars.length;
	         for (this.cn=0 ; cn<len ; cn++) {
	         this.c = chars[cn];
	         if (c === ' ')
	         buf.push(SPACE);
	         else if (c === '\n')
	         buf.push(LF);
	         else if (c === '\r')
	         buf.push(CR);
	         else {
	         this.uc = c.toUpper;
	         this.code = Baudot.baudLtrsToCode[uc];
	         if (code) {
	         if (txShifted) {
	         txShifted = false;
	         buf.push(LTRS);
	         }
	         buf.push(code)
	         } else {
	         code = Baudot.baudFigsToCode[uc];
	         if (code) {  //check for zero?
	         if (!txShifted) {
	         txShifted = true;
	         buf.push(FIGS);
	         }
	         buf.push(code);
	         }
	         }
	         }
	         }
	         return buf;
	         }
	          function txnext() {
	         //this.str = "the quick brown fox 1a2b3c4d"
	         this.str = par.gettext;
	         this.codes = txencode(str);
	         return codes;
	         }
	           this.desiredOutput = 4096;
	          */
	        /**
	         * Overridden from Mode.  This method is called by
	         * the audio interface when it needs a fresh buffer
	         * of sampled audio data at its sample rate.  If the
	         * mode has no current data, then it should send padding
	         * in the form of what is considered to be an "idle" signal
	         */
	        /*
	         this.transmit = function() {
	          this.symbollen = samplesPerSymbol;
	         this.buf = [];
	         this.codes = txnext();
	         this.len = codes.length;
	         for (this.idx = 0 ; idx < len ; idx++) {
	         this.code = codes[i];
	         for (this.s=0 ; s<symbollen ; s++) buf.push(spaceFreq);
	         this.mask = 1;
	         for (this.ib=0 ; ib < 5 ; ib++) {
	         this.bit = (code & mask) === 0;
	         this.f = (bit) ? spaceFreq : markFreq;
	         for (j=0 ; j < symbollen ; j++) buf.push(f);
	         mask <<= 1;
	         }
	         for (this.s2=0 ; s2<symbollen ; s2++) buf.push(spaceFreq);
	         }
	          this.pad = desiredOutput - buf.length;
	         while (pad--)
	         buf.push(spaceFreq);
	         //this.res = buf.toArray.map(txlpf.update)
	         //todo
	         };
	         */

	    }], [{
	        key: "countbits",
	        value: function countbits(n) {
	            var c = 0;
	            while (n) {
	                n &= n - 1;
	                c++;
	            }
	            return c;
	        }
	    }]);
	    return RttyMode;
	}(_fsk.FskBase); // RttyMode

	exports.RttyMode = RttyMode;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FskBase = undefined;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(31);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(59);

	var _get3 = _interopRequireDefault(_get2);

	var _set2 = __webpack_require__(63);

	var _set3 = _interopRequireDefault(_set2);

	var _inherits2 = __webpack_require__(64);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _mode = __webpack_require__(20);

	var _filter = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */
	/* jslint node: true */

	var SSIZE = 200;

	/**
	 * This is a base class for all two-tone FSK modes.
	 * @see http://en.wikipedia.org/wiki/Asynchronous_serial_communication
	 */

	var FskBase = function (_Mode) {
	    (0, _inherits3.default)(FskBase, _Mode);

	    function FskBase(par, props, sampleRateHint) {
	        (0, _classCallCheck3.default)(this, FskBase);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FskBase).call(this, par, props, sampleRateHint));

	        _this._shift = 170.0;
	        _this.inverted = false;
	        _this.rate = 45.0;
	        _this.samplesSinceChange = 0;
	        _this.lastbit = false;

	        //receive
	        _this.loHys = -1.0;
	        _this.hiHys = 1.0;
	        _this.bit = false;
	        _this.lastr = 0;
	        _this.lasti = 0;
	        _this.bitsum = 0;

	        //scope
	        _this.scopedata = new Array(_this.SSIZE);
	        _this.scnt = 0;
	        _this.sx = -1;
	        return _this;
	    }

	    (0, _createClass3.default)(FskBase, [{
	        key: "adjust",
	        value: function adjust() {
	            this.sf = _filter.FIR.bandpass(13, -0.75 * this.shift, -0.25 * this.shift, this.sampleRate);
	            this.mf = _filter.FIR.bandpass(13, 0.25 * this.shift, 0.75 * this.shift, this.sampleRate);
	            //dataFilter = FIR.boxcar((self.samplesPerSymbol * 0.7)|0 );
	            this.dataFilter = _filter.FIR.raisedcosine(13, 0.5, this.rate, this.sampleRate);
	            //dataFilter = FIR.lowpass(13, this.rate * 0.5, this.sampleRate);
	            //dataFilter = Biquad.lowPass(this.rate * 0.5, this.sampleRate);
	            this.symbollen = Math.round(this.samplesPerSymbol);
	            this.halfsym = this.symbollen >> 1;
	        }

	        /**
	         * note: multiplying one complex sample of an
	         * FM signal with the conjugate of the previous
	         * value gives the instantaneous frequency change of
	         * the signal.  This is called a polar discrminator.
	         */

	    }, {
	        key: "receive",
	        value: function receive(isample) {
	            var lastr = this.lastr;
	            var lasti = this.lasti;

	            var space = this.sf.updatex(isample);
	            var mark = this.mf.updatex(isample);
	            var r = space.r + mark.r;
	            var i = space.i + mark.i;
	            var x = r * lastr - i * lasti;
	            var y = r * lasti + i * lastr;
	            this.lastr = r; //save the conjugate
	            this.lasti = -i;
	            var angle = Math.atan2(y, x); //arg
	            var comp = angle > 0 ? -10.0 : 10.0;
	            var sig = this.dataFilter.update(comp);
	            //console.log("sig:" + sig + "  comp:" + comp)

	            this.scopeOut(sig);

	            var bit = this.bit;

	            //trace("sig:" + sig)
	            if (sig > this.hiHys) {
	                bit = false;
	            } else if (sig < loHys) {
	                bit = true;
	            }

	            bit = bit ^ this.inverted; //user-settable

	            this.processBit(bit);
	            this.bit = bit;
	        }
	    }, {
	        key: "processBit",
	        value: function processBit(bit, parms) {}

	        /**
	         * Used for modes without start/stop. Test if the current bit is the middle
	         * of where a symbol is expected to be.
	         */

	    }, {
	        key: "isMiddleBit",
	        value: function isMiddleBit(bit) {
	            this.samplesSinceChange = bit === this.lastbit ? this.samplesSinceChange + 1 : 0;
	            this.lastbit = bit;
	            var middleBit = this.samplesSinceChange % this.symbollen === this.halfsym;
	            return middleBit;
	        }
	    }, {
	        key: "scopeOut",
	        value: function scopeOut(v) {
	            var sign = v > 0 ? 1 : -1;
	            var scalar = Math.log(Math.abs(v) + 1) * 0.25;
	            this.scopedata[this.scnt++] = [this.sx, sign * scalar];
	            this.sx += 0.01;
	            if (this.scnt >= this.SSIZE) {
	                this.scnt = 0;
	                this.sx = -1;
	                this.par.showScope(this.scopedata);
	                this.scopedata = new Array(this.SSIZE);
	            }
	        }
	    }, {
	        key: "shift",
	        get: function get() {
	            return this._shift;
	        },
	        set: function set(v) {
	            this._shift = v;
	            this.adjust();
	        }
	    }, {
	        key: "bandwidth",
	        get: function get() {
	            return this._shift;
	        }
	    }, {
	        key: "rate",
	        set: function set(v) {
	            (0, _set3.default)((0, _getPrototypeOf2.default)(FskBase.prototype), "rate", v, this);
	            this.adjust();
	        },
	        get: function get() {
	            return (0, _get3.default)((0, _getPrototypeOf2.default)(FskBase.prototype), "rate", this);
	        }
	    }]);
	    return FskBase;
	}(_mode.Mode); // FskBase

	exports.FskBase = FskBase;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PacketMode = exports.Crc = undefined;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _possibleConstructorReturn2 = __webpack_require__(31);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(64);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _fsk = __webpack_require__(72);

	var _filter = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * CRC-CCITT-16 calculator, that handles both big and little-endian byte
	 * streams
	 */
	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */
	/* jslint node: true */

	var CrcTables = {

	    crcTable: [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0],

	    crcTableLE: [0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf, 0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7, 0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e, 0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876, 0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd, 0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5, 0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c, 0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974, 0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb, 0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3, 0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a, 0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72, 0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9, 0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1, 0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738, 0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70, 0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7, 0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff, 0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036, 0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e, 0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5, 0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd, 0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134, 0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c, 0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3, 0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb, 0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232, 0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a, 0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1, 0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9, 0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330, 0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78]
	};

	var Crc = function () {
	    function Crc() {
	        (0, _classCallCheck3.default)(this, Crc);

	        this.reset();
	    }

	    (0, _createClass3.default)(Crc, [{
	        key: "update",
	        value: function update(c) {
	            var table = CrcTables.crcTable;
	            var crc = this.crc;
	            var j = (c ^ crc >> 8) & 0xff;
	            this.crc = table[j] ^ crc << 8;
	        }
	    }, {
	        key: "value",
	        value: function value() {
	            return (this.crc ^ 0) & 0xffff;
	        }
	    }, {
	        key: "updateLE",
	        value: function updateLE(c) {
	            var table = CrcTables.crcTableLE;
	            var crc = this.crc;
	            this.crc = (crc >> 8 ^ table[(crc ^ c) & 0xff]) & 0xffff;
	        }
	    }, {
	        key: "valueLE",
	        value: function valueLE() {
	            return this.crc;
	        }
	    }, {
	        key: "reset",
	        value: function reset() {
	            this.crc = 0xffff;
	        }
	    }]);
	    return Crc;
	}();

	var PacketAddr = function () {
	    function PacketAddr(call, ssid) {
	        (0, _classCallCheck3.default)(this, PacketAddr);

	        this.call = call;
	        this.ssid = ssid;
	        this.add = null;
	    }

	    (0, _createClass3.default)(PacketAddr, [{
	        key: "encoded",
	        value: function encoded() {
	            var add = this.add;
	            if (add === null) {
	                var call = this.call;
	                add = new Array(7);
	                var len = call.length;
	                for (var i = 0; i < 7; i++) {
	                    if (i < len) add[i] = call[i].toInt << 1;else if (i == 6) add[i] = 0x60 | this.ssid << 1;else add[i] = 0x40; // shifted space
	                }
	                this.add = add;
	            }
	            return add;
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            return this.ssid >= 0 ? this.call + "-" + this.ssid : this.call;
	        }
	    }], [{
	        key: "fromData",
	        value: function fromData(arr, offset) {
	            var buf = "";
	            var bytes = arr.slice(offset, offset + 6).map(function (v) {
	                return v >> 1;
	            });
	            var call = String.fromCharCode.apply(null, bytes).trim();
	            var ssid = arr[offset + 6] >> 1 & 0xf;
	            return new PacketAddr(call, ssid);
	        }
	    }]);
	    return PacketAddr;
	}();

	var Types = {
	    PID_X25: 0x01, // ISO 8208/CCITT X.25 PLP
	    PID_TCPIP_COMP: 0x06, // Compressed TCP/IP packet. Van Jacobson (RFC 1144)
	    PID_TCPIP_UNCOMP: 0x07, // Uncompressed TCP/IP packet. Van Jacobson (RFC 1144)
	    PID_FRAG: 0x08, // Segmentation fragment
	    PID_AX25_FLAG1: 0x10, // AX.25 layer 3 implemented.
	    PID_AX25_FLAG2: 0x20, // AX.25 layer 3 implemented.
	    PID_AX25_MASK: 0x30, // AX.25 layer 3 implemented.
	    PID_TEXNET: 0xc3, // TEXNET datagram protocol
	    PID_LQP: 0xc4, // Link Quality Protocol
	    PID_APPLETALK: 0xca, // Appletalk
	    PID_APPLETALK_ARP: 0xcb, // Appletalk ARP
	    PID_ARPA_IP: 0xcc, // ARPA Internet Protocol
	    PID_ARPA_ARP: 0xcd, // ARPA Address Resolution
	    PID_FLEXNET: 0xce, // FlexNet
	    PID_NETROM: 0xcf, // NET/ROM
	    PID_NO_3: 0xf0, // No layer 3 protocol implemented.
	    PID_ESCAPE: 0xff, // Escape character. Next octet contains more Level 3 protocol information.

	    /**
	     * Frame identifiers
	     */
	    FID_NONE: 0, // Not an ID
	    FID_C: 1, // Layer 2 Connect Request
	    FID_SABM: 2, // Layer 2 Connect Request
	    FID_D: 3, // Layer 2 Disconnect Request
	    FID_DISC: 4, // Layer 2 Disconnect Request
	    FID_I: 5, // Information frame
	    FID_RR: 6, // Receive Ready. System Ready To Receive
	    FID_RNR: 7, // Receive Not Ready. TNC Buffer Full
	    FID_NR: 8, // Receive Not Ready. TNC Buffer Full
	    FID_RJ: 9, // Reject Frame. Out of Sequence or Duplicate
	    FID_REJ: 10, // Reject Frame. Out of Sequence or Duplicate
	    FID_FRMR: 11, // Frame Reject. Fatal Error
	    FID_UI: 12, // Unnumbered Information Frame. "Unproto"
	    FID_DM: 13, // Disconnect Mode. System Busy or Disconnected.

	    IFRAME: 0,
	    SFRAME: 1,
	    UFRAME: 2
	};

	var Packet = function () {
	    function Packet(dest, src, rpts, ctrl, pid, info) {
	        (0, _classCallCheck3.default)(this, Packet);

	        this.dest = dest;
	        this.src = src;
	        this.rpts = rpts;
	        this.ctrl = ctrl;
	        this.pid = pid;
	        this.info = info;
	    }

	    (0, _createClass3.default)(Packet, [{
	        key: "toOctets",
	        value: function toOctets() {
	            var buf = [];
	            buf[buf.length] = 0x7e; // flag
	            buf = buf.concat(this.dest.encoded());
	            buf = buf.concat(this.src.encoded());
	            for (var ridx = 0; ridx < this.rpts.length; ridx++) {
	                buf = buf.concat(this.rpts[ridx].encoded());
	            }
	            buf[buf.length] = this.ctrl;
	            buf[buf.length] = this.pid;
	            var ilen = info.length;
	            for (var iidx = 0; iidx < ilen; iidx++) {
	                buf[buf.length] = info[iidx];
	            }
	            var crc = new Crc();
	            for (var bidx = 0; bidx < buf.length; bidx++) {
	                crc.update(buf[bidx]);
	            }
	            var crcv = crc.value();
	            var fcslo = crcv & 0xff ^ 0xff;
	            var fcshi = crcv >> 8 ^ 0xff;
	            buf[buf.length] = fcslo;
	            buf[buf.length] = fcshi;
	            buf[buf.length] = 0x7e; // flag
	            return buf;
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            var buf = src.toString() + "=>" + dest.toString();

	            var len = rpts.length;
	            for (var ridx = 0; ridx < len; ridx++) {
	                buf += ":";
	                buf += r.toString();
	            }
	            buf += " [" + pid.toString() + "]: ";
	            if (pid !== 0) {
	                buf += String.fromCharCode.apply(null, info);
	            } else {
	                //for (v <- info)
	                //    buf.append(",").append(v.toString)
	                buf += "{" + info(0) + "," + info.size + "}";
	                buf += String.fromCharCode.apply(null, info);
	            }
	            return buf;
	        }
	    }], [{
	        key: "create",
	        value: function create() {
	            var pos = 0;
	            var dest = getAddr(data, pos);
	            pos += 7;
	            var src = getAddr(data, pos);
	            pos += 7;
	            var rpts = [];
	            //println("lastbyte:"+data(pos-1))
	            while (rpts.length < 8 && pos < data.length - 7 && (data[pos - 1] & 128) !== 0) {
	                rpts[rpts.length] = getAddr(data, pos);
	                pos += 7;
	            }

	            var ctrl = data[pos++];

	            var typ = (ctrl & 1) === 0 ? IFRAME : (ctrl & 2) === 0 ? SFRAME : UFRAME;

	            var pid = typ === IFRAME ? data[pos] : 0;
	            if (typ === IFRAME) pos++;

	            var info = data.slice(pos, data.length);

	            return new Packet(dest, src, rpts, 0, 0, info);
	        }
	    }]);
	    return Packet;
	}();

	function trace(msg) {
	    console.log(msg);
	}

	var RxStart = 0; //the initial state
	var RxTxd = 1; //after the first flag, wait until no more flags
	var RxData = 2; //after the flag.  all octets until another flag
	var RxFlag1 = 3; //Test whether we have a flag or a stuffed bit
	var RxFlag2 = 4; //It was a flag.  grab the last bit
	var FLAG = 0x7e; // 01111110 , the start/stop flag
	var RXLEN = 4096;

	/**
	 * Mode for AX-25 packet communications.
	 *
	 * Note:  apparently 4800s/s seems to be necessary for this to work on 1200baud
	 *
	 * @see http://www.tapr.org/pub_ax25.html
	 */

	var PacketMode = function (_FskBase) {
	    (0, _inherits3.default)(PacketMode, _FskBase);
	    (0, _createClass3.default)(PacketMode, null, [{
	        key: "props",
	        value: function props(self) {
	            return {
	                name: "packet",
	                tooltip: "AX.25 and APRS",
	                controls: [{
	                    name: "rate",
	                    type: "choice",
	                    tooltip: "packet data rate",
	                    get value() {
	                        return self.rate;
	                    },
	                    set value(v) {
	                        self.rate = parseFloat(v);
	                    },
	                    values: [{ name: "300", value: 300.0 }, { name: "1200", value: 1200.0 }]
	                }, {
	                    name: "shift",
	                    type: "choice",
	                    tooltip: "frequency distance between mark and space",
	                    get value() {
	                        return self.shift;
	                    },
	                    set value(v) {
	                        self.shift = parseFloat(v);
	                    },
	                    values: [{ name: "200", value: 200.0 }, { name: "1000", value: 1000.0 }]
	                }]
	            };
	        }
	    }]);

	    function PacketMode(par) {
	        (0, _classCallCheck3.default)(this, PacketMode);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PacketMode).call(this, par, PacketMode.props, 4800.0));

	        _this.shift = 200.0;
	        _this.rate = 300.0;
	        _this.state = RxStart;
	        _this.bitcount = 0;
	        _this.octet = 0;
	        _this.ones = 0;
	        _this.bufPtr = 0;
	        _this.rxbuf = new Array(RXLEN);
	        _this.lastBit = false;
	        return _this;
	    }

	    /**
	     * Attempt to decode a packet.  It will be in NRZI form, so when
	     * we sample at mid-pulse (period == halflen) we need to sense then
	     * if the bit has flipped or not.  Do -not- check this for every sample.
	     * the packet will be in the form:
	     * 01111110 76543210 76543210 76543210 01234567 01234567 01111110
	     *   flag    octet     octet   octet    fcs_hi   fcs_lo    flag
	     */

	    (0, _createClass3.default)(PacketMode, [{
	        key: "processBit",
	        value: function processBit(inBit) {

	            if (!this.isMiddleBit(inBit)) {
	                return;
	            }

	            //shift right for the next bit, since ax.25 is lsb-first
	            var octet = this.octet >> 1 & 0x7f; //0xff? we dont want the msb
	            this.octet = octet;
	            var bit = inBit === this.lastBit; //google "nrzi"
	            this.lastBit = inBit;
	            if (bit) {
	                this.ones += 1;
	                octet |= 128;
	            } else this.ones = 0;

	            switch (this.state) {

	                case RxStart:
	                    //trace("RxStart");
	                    //trace("st octet: %02x".format(octet));
	                    if (octet === FLAG) {
	                        this.state = RxTxd;
	                        this.bitcount = 0;
	                    }
	                    break;

	                case RxTxd:
	                    //trace("RxTxd");
	                    if (++this.bitcount >= 8) {
	                        //trace("txd octet: %02x".format(octet));
	                        this.bitcount = 0;
	                        if (octet !== FLAG) {
	                            this.state = RxData;
	                            this.rxbuf[0] = octet & 0xff;
	                            this.bufPtr = 1;
	                        }
	                    }
	                    break;

	                case RxData:
	                    //trace("RxData");
	                    if (this.ones === 5) {
	                        // 111110nn, next bit will determine
	                        this.state = RxFlag1;
	                    } else {
	                        if (++this.bitcount >= 8) {
	                            this.bitcount = 0;
	                            if (this.bufPtr >= RXLEN) {
	                                //trace("drop")
	                                this.state = RxStart;
	                            } else {
	                                this.rxbuf[this.bufPtr++] = octet & 0xff;
	                            }
	                        }
	                    }
	                    break;

	                case RxFlag1:
	                    //trace("RxFlag");
	                    if (bit) {
	                        //was really a 6th bit.
	                        this.state = RxFlag2;
	                    } else {
	                        //was a zero.  drop it and continue
	                        octet = octet << 1 & 0xfe;
	                        this.state = RxData;
	                    }
	                    break;

	                case RxFlag2:
	                    //we simply wanted that last bit
	                    this.processPacket(this.rxbuf, this.bufPtr);
	                    for (var rdx = 0; rdx < RXLEN; rdx++) {
	                        this.rxbuf[rdx] = 0;
	                    }this.state = RxStart;
	                    break;

	                default:
	                //dont know

	            } //switch
	        }
	    }, {
	        key: "rawPacket",
	        value: function rawPacket(ibytes, offset, len) {
	            var str = "";
	            for (var i = 0; i < len; i++) {
	                var b = ibytes[offset + i]; // >> 1;
	                str += String.fromCharCode(b);
	            }
	            return str;
	        }
	    }, {
	        key: "processPacket",
	        value: function processPacket(data, len) {

	            //trace("raw:" + len)
	            if (len < 14) return true;
	            var str = this.rawPacket(data, 14, len - 2);
	            trace("txt: " + str);
	            var crc = new Crc();
	            for (var i = 0; i < len; i++) {
	                crc.updateLE(data[i]);
	            }
	            var v = crc.valueLE();
	            trace("crc: " + v.toString(16));
	            //theory is, if you calculate the CRC of the data, -including- the crc field,
	            //a correct result will always be 0xf0b8
	            if (v === 0xf0b8) {
	                var p = Packets.create(data);
	                this.par.puttext(p.toString() + "\n");
	            }
	            return true;
	        }

	        /*
	         //################################################
	         //# T R A N S M I T
	         //################################################
	         private var txShifted = false
	         def txencode(str: String) : Seq[Int] =
	         {
	         var buf = scala.collection.mutable.ListBuffer[Int]()
	         for (c <- str)
	         {
	         if (c == ' ')
	         buf += Baudot.BAUD_SPACE
	         else if (c == '\n')
	         buf += Baudot.BAUD_LF
	         else if (c == '\r')
	         buf += Baudot.BAUD_CR
	         else
	         {
	         var uc = c.toUpper
	         var code = Baudot.baudLtrsToCode.get(uc)
	         if (code.isDefined)
	         {
	         if (txShifted)
	         {
	         txShifted = false
	         buf += Baudot.BAUD_LTRS
	         }
	         buf += code.get
	         }
	         else
	         {
	         code = Baudot.baudFigsToCode.get(uc)
	         if (code.isDefined)
	         {
	         if (!txShifted)
	         {
	         txShifted = true
	         buf += Baudot.BAUD_FIGS
	         }
	         buf += code.get
	         }
	         }
	         }
	         }
	         buf.toSeq
	         }
	           def txnext : Seq[Int] =
	         {
	         //var str = "the quick brown fox 1a2b3c4d"
	         var str = par.gettext
	         var codes = txencode(str)
	         codes
	         }
	             private var desiredOutput = 4096;
	           /o*
	         * Overridden from Mode.  This method is called by
	         * the audio interface when it needs a fresh buffer
	         * of sampled audio data at its sample rate.  If the
	         * mode has no current data, then it should send padding
	         * in the form of what is considered to be an "idle" signal
	         o/
	         override def transmit : Option[Array[Complex]] =
	         {
	         var symbollen = samplesPerSymbol.toInt
	         var buf = scala.collection.mutable.ListBuffer[Complex]()
	         var codes = txnext
	         for (code <- codes)
	         {
	         for (i <- 0 until symbollen) buf += spaceFreq
	         var mask = 1
	         for (i <- 0 until 5)
	         {
	         var bit = (code & mask) == 0
	         var f = if (bit) spaceFreq else markFreq
	         for (j <- 0 until symbollen) buf += f
	         mask <<= 1
	         }
	         for (i <- 0 until symbollen) buf += spaceFreq
	         }
	           var pad = desiredOutput - buf.size
	         for (i <- 0 until pad)
	         buf += spaceFreq
	         //var res = buf.toArray.map(txFilter.update)
	         None
	         }
	           */

	    }]);
	    return PacketMode;
	}(_fsk.FskBase);

	exports.Crc = Crc;
	exports.PacketMode = PacketMode;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */
	/* jslint node: true */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NavtexMode = undefined;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(31);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(64);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _fsk = __webpack_require__(72);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CCIR = function () {

	    var t = [];
	    t[0x3a] = ['Q', '1'];
	    /*0111010*/
	    t[0x72] = ['W', '2'];
	    /*1110010*/
	    t[0x35] = ['E', '3'];
	    /*0110101*/
	    t[0x55] = ['R', '4'];
	    /*1010101*/
	    t[0x17] = ['T', '5'];
	    /*0010111*/
	    t[0x6a] = ['Y', '6'];
	    /*1101010*/
	    t[0x39] = ['U', '7'];
	    /*0111001*/
	    t[0x59] = ['I', '8'];
	    /*1011001*/
	    t[0x47] = ['O', '9'];
	    /*1000111*/
	    t[0x5a] = ['P', '0'];
	    /*1011010*/
	    t[0x71] = ['A', '-'];
	    /*1110001*/
	    t[0x69] = ['S', '\''];
	    /*1101001*/
	    t[0x65] = ['D', '$'];
	    /*1100101*/
	    t[0x6c] = ['F', '!'];
	    /*1101100*/
	    t[0x56] = ['G', '&'];
	    /*1010110*/
	    t[0x4b] = ['H', '#'];
	    /*1001011*/
	    t[0x74] = ['J', 7];
	    /*1110100*/
	    t[0x3c] = ['K', '['];
	    /*0111100*/
	    t[0x53] = ['L', ']'];
	    /*1010011*/
	    t[0x63] = ['Z', '+'];
	    /*1100011*/
	    t[0x2e] = ['X', '/'];
	    /*0101110*/
	    t[0x5c] = ['C', ':'];
	    /*1011100*/
	    t[0x1e] = ['V', '='];
	    /*0011110*/
	    t[0x27] = ['B', '?'];
	    /*0100111*/
	    t[0x4d] = ['N', ','];
	    /*1001101*/
	    t[0x4e] = ['M', '.'];
	    /*1001110*/
	    t[0x1d] = [' ', ' '];
	    t[0x0f] = ['\n', '\n']; //actually \r
	    t[0x1b] = ['\n', '\n'];

	    var NUL = 0x2b;
	    var SPACE = 0x1d;
	    var CR = 0x0f;
	    var LF = 0x1b;
	    var LTRS = 0x2d;
	    var FIGS = 0x36;
	    var ALPHA = 0x78;
	    var BETA = 0x66;
	    var SYNC = 0x00;
	    var REPEAT = 0x33;

	    var cls = {
	        NUL: NUL,
	        SPACE: SPACE,
	        CR: CR,
	        LF: LF,
	        LTRS: LTRS,
	        FIGS: FIGS,
	        ALPHA: ALPHA,
	        BETA: BETA,
	        SYNC: SYNC,
	        REPEAT: REPEAT
	    };
	    cls.isValid = function (code) {
	        return t[code] !== undefined || code === NUL || code === LTRS || code === FIGS || code === ALPHA || code === BETA || code === SYNC || code === REPEAT;
	    };
	    cls.t = t;

	    return cls;
	}();

	var RxSync1 = 0;
	var RxSync2 = 1;
	var RxData = 2;

	var ResultOk = 0;
	var ResultSoft = 1;
	var ResultFail = 2;
	var ResultEom = 3;

	function reverse(v, len) {
	    var a = v;
	    var b = 0;
	    for (var i = 0; i < len; i++) {
	        b = (b << 1) + (a & 1);
	        a >>= 1;
	    }
	    return b;
	}

	/**
	 *
	 * @see http://en.wikipedia.org/wiki/Asynchronous_serial_communication
	 *
	 */

	var NavtexMode = function (_FskBase) {
	    (0, _inherits3.default)(NavtexMode, _FskBase);
	    (0, _createClass3.default)(NavtexMode, null, [{
	        key: "props",
	        value: function props(self) {
	            return {
	                name: "navtex",
	                tooltip: "international naval teleprinter",
	                controls: [{
	                    name: "inv",
	                    type: "boolean",
	                    get value() {
	                        return self.inverted;
	                    },
	                    set value(v) {
	                        self.inverted = v;
	                    }
	                }, {
	                    name: "UoS",
	                    type: "boolean",
	                    get value() {
	                        return self.unshiftOnSpace;
	                    },
	                    set value(v) {
	                        self.unshiftOnSpace = v;
	                    }
	                }]
	            };
	        }
	    }]);

	    function NavtexMode(par) {
	        (0, _classCallCheck3.default)(this, NavtexMode);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(NavtexMode).call(this, par, NavtexMode.props, 1000.0));

	        _this.unshiftOnSpace = false;
	        _this.shift = 170.0;
	        _this.rate = 100.0;
	        _this.state = RxSync1;
	        _this.bitcount = 0;
	        _this.code = 0;
	        _this.parityBit = false;
	        _this.bitMask = 0;

	        /**
	         * Since there is no start or stop bit, we must sync ourselves.
	         * But syncing is very simple.  We shift the bits through four 7-bit
	         * shift registers.  When all four have valid characters, we consider
	         * it to be synced.
	         */
	        _this.errs = 0;
	        _this.sync1 = 0;
	        _this.sync2 = 0;
	        _this.sync3 = 0;
	        _this.sync4 = 0;

	        _this.shifted = false;
	        //Sitor-B is in either DX (data) or RX (repeat) mode
	        _this.dxMode = true;

	        _this.q3 = 0;
	        _this.q2 = 0;
	        _this.q1 = 0;

	        _this.lastChar = '@';
	        return _this;
	    }

	    (0, _createClass3.default)(NavtexMode, [{
	        key: "shift7",
	        value: function shift7(bit) {
	            var a = bit ? 1 : 0;
	            var b = this.sync1 >> 6 & 1;
	            this.sync1 = (this.sync1 << 1) + a & 0x7f;
	            a = b;
	            b = this.sync2 >> 6 & 1;
	            this.sync2 = (this.sync2 << 1) + a & 0x7f;
	            a = b;
	            b = this.sync3 >> 6 & 1;
	            this.sync3 = (this.sync3 << 1) + a & 0x7f;
	            a = b;
	            this.sync4 = (this.sync4 << 1) + a & 0x7f;
	        }
	    }, {
	        key: "processBit",
	        value: function processBit(bit) {

	            if (!this.isMiddleBit(bit)) {
	                return;
	            }

	            switch (this.state) {
	                case RxSync1:
	                    //trace("RxSync1")
	                    this.state = RxSync2;
	                    this.bitcount = 0;
	                    this.code = 0;
	                    this.errs = 0;
	                    this.sync1 = 0;
	                    this.sync2 = 0;
	                    this.sync3 = 0;
	                    this.sync4 = 0;
	                    break;
	                case RxSync2:
	                    //trace("Rxthis.sync2")
	                    this.shift7(bit);
	                    //trace(this.sync1.toHexString + ", "+  this.sync2.toHexString + ", " +
	                    //     this.sync3.toHexString + ", " + this.sync4.toHexString);
	                    //trace("bit: " + bit);
	                    if (CCIR.isValid(this.sync1) && CCIR.isValid(this.sync2) && CCIR.isValid(this.sync3) && CCIR.isValid(this.sync4)) {
	                        this.processCode(this.sync1);
	                        this.processCode(this.sync2);
	                        this.processCode(this.sync3);
	                        this.processCode(this.sync4);
	                        this.state = RxData;
	                    }
	                    break;
	                case RxData:
	                    //trace("RxData");
	                    this.code = (this.code << 1) + (bit ? 1 : 0) & 0x7f;
	                    //trace("code: " + code);
	                    if (++this.bitcount >= 7) {
	                        if (this.processCode(this.code) != ResultFail) {
	                            //we want Ok or Soft
	                            //stay in RxData.  ready for next code
	                            this.code = 0;
	                            this.bitcount = 0;
	                        } else {
	                            this.code = 0;
	                            this.bitcount = 0;
	                            this.errs++;
	                            if (this.errs > 3) {
	                                this.state = RxSync1;
	                                //trace("return to sync")
	                            }
	                        }
	                    }
	                    break;
	                default:
	            } //switch
	        }
	    }, {
	        key: "qadd",
	        value: function qadd(v) {
	            this.q3 = this.q2;
	            this.q2 = this.q1;
	            this.q1 = v;
	        }
	    }, {
	        key: "processCode",
	        value: function processCode(code) {
	            //trace("code: " + code.toHexString + " mode: " + dxMode)
	            var res = ResultOk;
	            if (this.code === CCIR.REPEAT) {
	                this.qadd(this.code);
	                this.shifted = false;
	                this.dxMode = false;
	            } else if (this.code === CCIR.ALPHA) {
	                this.shifted = false;
	                this.dxMode = true;
	            } else {
	                if (this.dxMode) {
	                    if (!CCIR.isValid(this.code)) res = ResultSoft;
	                    this.qadd(code); //dont think.  just queue it
	                    this.dxMode = false; //for next time
	                } else {
	                        //symbol
	                        if (CCIR.isValid(this.code)) {
	                            this.processCode2(this.code);
	                        } else {
	                            if (CCIR.isValid(this.q3)) {
	                                var c = this.processCode2(this.q3);
	                                this.par.status("FEC replaced :" + c);
	                                res = ResultSoft;
	                            } else {
	                                this.processCode2(-1);
	                                res = ResultFail;
	                            }
	                        }
	                        this.dxMode = true; // next time
	                    } //rxmode
	            } //symbol
	            return res;
	        }
	    }, {
	        key: "processCode2",
	        value: function processCode2(code) {
	            var res = '@';
	            if (code === 0) {
	                //shouldnt happen
	            } else if (code < 0) {
	                    //par.puttext("_");
	                    res = '_';
	                } else if (code === CCIR.ALPHA || code === CCIR.REPEAT) {
	                    //shouldnt be here
	                } else if (code === CCIR.LTRS) {
	                        this.shifted = false;
	                    } else if (code === CCIR.FIGS) {
	                        this.shifted = true;
	                    } else {
	                        var v = CCIR.t[code];
	                        if (v !== undefined) {
	                            var c = this.shifted ? v[1] : v[0];
	                            this.par.puttext(c);
	                            res = c;
	                        }
	                    }
	            this.lastChar = res;
	            return res;
	        }
	    }]);
	    return NavtexMode;
	}(_fsk.FskBase); // NavtexMode

	exports.NavtexMode = NavtexMode;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Watcher = undefined;

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Jdigi
	 *
	 * Copyright 2015, Bob Jamison
	 *
	 *    This program is free software: you can redistribute it and/or modify
	 *    it under the terms of the GNU General Public License as published by
	 *    the Free Software Foundation, either version 3 of the License, or
	 *    (at your option) any later version.
	 *
	 *    This program is distributed in the hope that it will be useful,
	 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
	 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 *    GNU General Public License for more details.
	 *
	 *    You should have received a copy of the GNU General Public License
	 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * @param par Digi
	 */

	var Watcher = function () {
	    function Watcher(par) {
	        (0, _classCallCheck3.default)(this, Watcher);

	        this.par = par;

	        //This regex's groups are prefix, digit, suffix
	        this.prefix = "([A-Z]{1,2}|[0-9][A-Z]|[A-Z][0-9])";
	        this.digits = "([0-9])";
	        this.suffix = "(F[A-Z]{3}|[A-Z]{1,3})"; //note:  Fxxx is australian
	        this.call = prefix + digits + suffix;
	        this.spot = "[^a-z0-9](?:de|cq)\\s+(" + call + ")[^a-z0-9]";
	        //var spot2 = "\\s+(" + call + ")\\s+[Kk]\\s";
	        //var spot3 = "\\s+(" + call + ")\\s+[Cc][Qq]";
	        //var spot = spot1 + "|" + spot2 + "|" + spot3;
	        this.buf = "";
	        this.calls = {};

	        this.useQrz = false;

	        this.timeout = 300000; //5 mins
	    }

	    (0, _createClass3.default)(Watcher, [{
	        key: "showQrz",
	        value: function showQrz(call) {
	            if (this.useQrz) window.open("http://qrz.com/db/" + call, "qrzquery", "menubar=true,toolbar=true");
	        }
	    }, {
	        key: "announce",
	        value: function announce(call) {
	            var msg = call.ts.toUTCString() + " : " + call.call + " : " + call.freq + " : " + call.mode + "/" + call.rate;
	            this.par.status(msg);
	            this.showQrz(call.call);
	        }
	    }, {
	        key: "check",
	        value: function check(call) {
	            var csn = call.call;
	            if (csn in this.calls) {
	                var curr = this.calls[csn];
	                var diff = call.ts.getTime() - curr.ts.getTime();
	                if (diff > this.timeout) {
	                    curr.ts = call.ts;
	                    this.announce(call);
	                }
	            } else {
	                this.calls[csn] = call;
	                this.announce(call);
	            }
	        }
	    }, {
	        key: "searchBuffer",
	        value: function searchBuffer(str) {
	            var rgx = new RegExp(spot, "ig");
	            for (var res = rgx.exec(str); res !== null; res = rgx.exec(str)) {
	                var mode = this.par.getMode();
	                var name = mode.properties.name;
	                var rate = mode.getRate();
	                var _call = {
	                    call: res[1].toLowerCase(),
	                    prefix: res[2].toLowerCase(),
	                    digit: res[3],
	                    suffix: res[4].toLowerCase(),
	                    freq: par.getFrequency(),
	                    mode: name,
	                    rate: rate,
	                    ts: new Date() //timestamp
	                };
	                this.check(_call);
	            }
	        }
	    }, {
	        key: "update",
	        value: function update(str) {
	            this.buf += str;
	            this.searchBuffer(this.buf);
	            var len = this.buf.length;
	            if (len > 30) {
	                this.buf = this.buf.substring(20, len);
	            }
	        }
	    }]);
	    return Watcher;
	}();

	exports.Watcher = Watcher;

/***/ }
/******/ ]);