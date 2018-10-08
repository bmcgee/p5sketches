// helper functions via
// https://github.com/borismus/spectrograph/blob/master/g-spectrograph.js
// MIT license

/**
 * Given an index and the total number of entries, return the
 * log-scaled value.
 */

 function smoothVal(obj) {
        // console.log(obj);
         obj.valSmoothed *= obj.smooth;
        // console.log(obj.valSmoothed);
         if (obj.valSmoothed < obj.val) {
                 obj.valSmoothed = (((obj.val - obj.valSmoothed) * (obj.smooth)) + obj.val);
         };
         return obj.valSmoothed;
 }

function logScale(index, total, opt_base) {
        var base = opt_base || 2;
        var logmax = logBase(total + 1, base);
        var exp = logmax * index / total;
        return Math.round(Math.pow(base, exp) - 1);
}

function logBase(val, base) {
        return Math.log(val) / Math.log(base);
}

function xScale(x, min, max) {
        let t = min * (max / min);
        x = math.pow(t, x);
}

function db(x) {
        if (x == 0) {
                return 0;
        } else {
                return 10 * Math.log10(x);
        }
}

function xSnap(x) {
        let h = 96;
        x = x / h;
        x = Math.round(x);
        x = x * h;
        return x;
}

function ySnap(y) {
        let w = 54;
        y = y / w;
        y = Math.round(y);
        y = y * w;
        return y;
}
// function buffSmooth(value, smoothRate) {
// 	valSmoothed *= smoothRate;
// 	if (valSmoothed < value) valSmoothed = value;
// 	return valSmoothed;
// }
