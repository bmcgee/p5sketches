function smoothVal(obj) {
        // console.log(obj);
        obj.valSmoothed *= obj.smoothIn;
        // console.log(obj.valSmoothed);
        // if (valSmoothed < value) valSmoothed = value;
        if (obj.valSmoothed < obj.val) {
                //a(i+1) = tiny*data(i+1) + (1.0-tiny)*a(i)
                obj.valSmoothed = obj.valSmoothed + ((obj.val - obj.valSmoothed) * (obj.smoothOut));
        };
        return obj.valSmoothed;
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


function db(x) {
        if (x == 0) {
                return 0;
        } else {
                return 10 * Math.log10(x);
        }
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


// function buffSmooth(value, smoothRate) {
// 	valSmoothed *= smoothRate;
// 	if (valSmoothed < value) valSmoothed = value;
// 	return valSmoothed;
// }
