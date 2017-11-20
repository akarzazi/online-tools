function bootstrap() {
    var pages = document.querySelectorAll(".page")

    pages.forEach(function (element) {
        window[element.id + "_page"](element);
    }, this);
};


function urlencode_page(page) {
    var methods = {};
    methods["encodeURI"] = window.encodeURI;
    methods["encodeURIComponent"] = window.encodeURIComponent;
    methods["decodeURI"] = window.decodeURI;
    methods["decodeURIComponent"] = window.decodeURIComponent;

    let srcArea = page.querySelector(".src");
    let destArea = page.querySelector(".dest");
    let methodSelect = page.querySelector(".method");

    srcArea.addEventListener('input', update);
    methodSelect.addEventListener('change', update)

    function update() {
        var srcText = srcArea.value;
        var method = methods[methodSelect.value];
        destArea.value = method(srcText);
    }
}

function htmlencode_page(page) {
    function htmlEncode(html) {
        return document.createElement('textarea')
            .appendChild(document.createTextNode(html))
            .parentNode.innerHTML;
    };

    function htmlDecode(html) {
        var a = document.createElement('textarea');
        a.innerHTML = html;
        return a.textContent;
    };

    var methods = {};
    methods["htmlencode"] = htmlEncode;
    methods["htmldecode"] = htmlDecode;

    let srcArea = page.querySelector(".src");
    let destArea = page.querySelector(".dest");
    let methodSelect = page.querySelector(".method");

    srcArea.addEventListener('input', update);
    methodSelect.addEventListener('change', update)

    function update() {
        var srcText = srcArea.value;
        var method = methods[methodSelect.value];
        destArea.value = method(srcText);
    }
}

function base64encode_page(page) {
    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    function b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    var methods = {};
    methods["base64encode"] = b64EncodeUnicode;
    methods["base64decode"] = b64DecodeUnicode;

    let srcArea = page.querySelector(".src");
    let destArea = page.querySelector(".dest");
    let methodSelect = page.querySelector(".method");
    let errorLbl = page.querySelector(".error");

    srcArea.addEventListener('input', update);
    methodSelect.addEventListener('change', update)

    function update() {
        errorLbl.innerText = "";
        var srcText = srcArea.value;
        var method = methods[methodSelect.value];
        try {
            destArea.value = method(srcText);
        }
        catch (e) {
            errorLbl.innerText = e.toString();
        }
    }
}

function utf8charcodes_page(page) {
    let srcArea = page.querySelector(".src");
    let destPre = page.querySelector(".dest");

    srcArea.addEventListener('input', update);

    function update() {
        var srcText = srcArea.value;
        var output = '';
        for (var i = 0; i < srcText.length; i++) {
            output += JSON.stringify(srcText[i]) + "\u00A0" + ':' + "\u00A0" + srcText[i].charCodeAt(0) + '\t';
        }
        destPre.innerText = output;
    }
}


function hashes_page(page) {

    var methods = {};
    methods["MD5"] = function (input) { return CryptoJS.MD5(input).toString() };
    methods["SHA1"] = function (input) { return CryptoJS.SHA1(input).toString() };
    methods["SHA256"] = function (input) { return CryptoJS.SHA256(input).toString() };
    methods["SHA512"] = function (input) { return CryptoJS.SHA512(input).toString() };

    let srcArea = page.querySelector(".src");
    let destArea = page.querySelector(".dest");
    let methodSelect = page.querySelector(".method");

    srcArea.addEventListener('input', update);
    methodSelect.addEventListener('change', update)

    function update() {
        var method = methods[methodSelect.value];
        destArea.value = method(srcArea.value);
    }
}

function numbersEncoding_page(page) {
    function getBuffer(num) {
        var buffer = new ArrayBuffer(8);
        var dataview = new DataView(buffer);
        dataview.setFloat64(0, num);
        return buffer;
    }

    function buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('-');
    }

    function buf2bin(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ("000000000" + x.toString(2)).substr(-8)).join('-');
    }

    let srcInput = page.querySelector(".src");
    let destPre = page.querySelector(".dest");

    srcInput.addEventListener('input', update);

    function update() {
       
        var srcText = srcInput.value;
        var buffer = getBuffer(srcText);

        var output = '';
        output += "ToPrecision(100): " + (new Number(srcText)).toPrecision(100) + "\n";
        output += "HEX             : " + buf2hex(buffer) + "\n";
        output += "Binary          : " + buf2bin(buffer) + "\n";

        destPre.innerText = output;
    }
}

