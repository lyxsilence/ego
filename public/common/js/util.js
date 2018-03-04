  // 通过id获取节点
function $(objid) {
    var obj = null;
    if (typeof objid == 'string') {
        if (document.getElementById) {
            obj = document.getElementById(objid);
        } else if (document.all) {
            obj = document.all[objid];
        } else if (document.layers) {
            obj = document.layers[objid];
        }
    }
    return obj;
};

// Trim:清除两边空格
function trim(str) {
    if (typeof str == 'string') return str.replace(/(^\s*)|(\s*$)/g, '');
};
// isPhone:是否为正确的手机号
function isPhone(str) {
    var regu = /(^[1][3][0-9]{9}$)|(^0[1][3][0-9]{9}$)/;
    var re = new RegExp(regu);
    if (re.test(str)) { return true; } else { return false; }
};
// isEmpty:是否为空
function isEmpty(str) {
    if (str == null || typeof str == "undefined" || str.trim() == "") {
        return true;
    } else {
        return false;
    }
};
var emitter = {
    // 注册事件
    on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
            calls = handles[event] || (handles[event] = []);

        // 找到对应名字的栈
        calls.push(fn);

        return this;
    },
    // 解绑事件
    off: function(event, fn) {
        if (!event || !this._handles) this._handles = {};
        if (!this._handles) return;

        var handles = this._handles,
            calls;

        if (calls = handles[event]) {
            if (!fn) {
                handles[event] = [];
                return this;
            }
            // 找到栈内对应listener 并移除
            for (var i = 0, len = calls.length; i < len; i++) {
                if (fn === calls[i]) {
                    calls.splice(i, 1);
                    return this;
                }
            }
        }
        return this;
    },
    // 触发事件
    emit: function(event) {
        var args = [].slice.call(arguments, 1),
            handles = this._handles,
            calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
            calls[i].apply(this, args);
        }
        return this;
    }
};

function html2node(str) {
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
};

// 赋值属性
// extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
function extend(o1, o2) {
    for (var i in o2)
        if (typeof o1[i] === 'undefined') {
            o1[i] = o2[i];
        }
    return o1;
};

function hasClass(node, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    return node.className.match(reg);
};

function addClass(node, className) {
    var current = node.className || "";
    if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
        node.className = current ? (current + " " + className) : className;
    }
};

function delClass(node, className) {
    var current = node.className || "";
    node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
};
// ajax封装
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function() {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    } else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}