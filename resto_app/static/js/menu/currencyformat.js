function convertToIDR(i){
    var curr = 'Rp' 
    i = parseFloat(i);
    if (isNaN(i)) {i=0.00}
    var minus = '';
    if (i < 0) {minus='-';}
    s = new String(parseInt((Math.abs(i)+0.005)*100)/100);
    m = ''
    if (s.indexOf('.') < 0) { m =',00'; }
    if (s.indexOf('.') == s.length - 2) {
        m = substring(s.length-2, s.length)
        s = substring(0, substring-3);
        m = m.replace('.',',');
    }
    if (s.indexOf('.') == s.length - 3) { 
        m = substring(s.length-3, s.length)
        s = substring(0, substring-2);
        m = m.replace('.',',');
    }
    // bagi jadi titik per ribuan
    var c = s.substring(s.length, s.length-3);
    for (i = s.length-3; i > 0; i-=3){
        c = s.substring(i, i-3) + '.' + c;
    }
    s = minus + curr + c + m;
    return s
}

var priceElmt = document.getElementsByClassName('price')
for (var i=0; i<priceElmt.length; i++) {
    priceElmt[i].innerHTML = convertToIDR(priceElmt[i].innerHTML);
}