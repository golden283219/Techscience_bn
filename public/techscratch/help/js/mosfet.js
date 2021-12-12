

function units(x) {
  x = x.trim();
if (x.match(/m$/)) {
    x = x.replace(/m$/, "");
   return .001 * x;
}
// don't think we need this but you never know
if (x.match(/u$/)) {
    x = x.replace(/u$/, "");
    return 1e-6 * x;
}

return x;
}

function calc() {
var rds = units(document.getElementById('rds').value);
var vgs = units(document.getElementById('vgs').value);
var vt = units(document.getElementById('vt').value);
var beta = Math.abs(1/(rds*(vgs-vt)));
document.getElementById('result').innerHTML = "beta = " + beta;
}