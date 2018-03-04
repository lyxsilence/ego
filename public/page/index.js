/*
 * @Author: lyx 
 * @Date: 2017-12-06 14:30:29 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-03 15:29:57
 */

(function(App) {
    // 帮助函数
    // 将HTML转换为节点
    var template = `
            <div class="tabs_track">
                <div class="tabs_thumb"></div>
            </div>`;

    function Tabs(options) {
        extend(this, options)
            // options = options || {};
        this.index = this.index || 0;
        // 缓存节点
        this.nTab = this.container.getElementsByTagName('ul')[0];
        this.nTabs = this.nTab.children;
        // 动态创建节点
        this.nTrack = this.container.appendChild(this._layout.cloneNode(true));
        this.nThum = this.container.querySelector('.tabs_thumb');
        this.init();
    }
    Tabs.prototype._layout = html2node(template);
    Tabs.prototype.init = function() {
        // 绑定事件
        for (var i = 0; i < this.nTabs.length; i++) {
            this.nTabs[i].addEventListener('mouseenter', function(index) {
                this.highlight(index);
            }.bind(this, i))
            this.nTabs[i].addEventListener('click', function(index) {
                this.setCurrent(index)
            }.bind(this, i))
        }
        // 解绑事件
        this.nTab.addEventListener('mouseleave', function() {
            this.highlight(this.index);
        }.bind(this));
        this.setCurrent(this.index);
        };
    Tabs.prototype.highlight = function(index) {
        var tabs = this.nTabs[index];
        this.nThum.style.width = tabs.offsetWidth + 'px';
        this.nThum.style.left = tabs.offsetLeft + 'px';
    };
    Tabs.prototype.setCurrent = function(index) {
        delClass(this.tabs[this.index], 'z-active');
        this.index = index;
        addClass(this.tabs[index], 'z-active');
        this.highlight(index);
    };
    // 直接暴露到全局
    window.Tabs = Tabs;

}());
// window.onload = function() {
//         var hdtab = new Tabs({
//             container: $('hdtabs'),
//         });
//         hdtab.init();
//         hdtab.highlight();
//         hdtab.setCurrent();
//         var sidetab = new Tabs({
//             container: $('sidetabs'),
//         });
//         sidetab.init();
//         sidetab.highlight();
//         sidetab.setCurrent();
//     }
// hdtabs
// (function() {
// var Tabs = window.Tabs({
//     container:[
//         $('hdtabs'),
//         $('sideabs')
//     ]
// })
// var hdtabs = new window.Tabs({
//     container: $('hdtabs'),
// });
// // var nThum = document.getElementsByClassName('tabs_thumb');
// hdtabs.init();
// hdtabs.highlight();
// hdtabs.setCurrent();
// hdtabs();
// var sidetabs = new window.Tabs({
//     container: $('sidetabs'),
// });
// // var nThum = document.getElementsByClassName('tabs_thumb');
// sidetabs.init();
// sidetabs.highlight();
// sidetabs.setCurrent();
// sidetabs();
// })



// 搜索框
(function(App) {
    function Search(container) {
        this.nForm = this.container;
        // this.nForm = document.getElementById('search');
        this.nKeyword = this.nForm.getElementsByTagName('input')[0];
        this.init();
    }
    Search.prototype.init = function() {
        this.nForm.addEventListener('submit', this.search.bind(this));
    }
    Search.prototype.search = function(event) {
        if (this.nKeyword.value.trim() === '') {
            return
        }
    }
    window.Search = Search;

}(window.App));
// 导航栏
(function(App) {
    var iconConfig = [
        'u-icon-male',
        'u-icon-female'
    ];
    var nav = {
        init: function(options) {
            options = options || {};
            this.loginCallback = options.login;
            this.hdtab = new window.Tabs({
                container: $('hdtabs')
            })
            this.hdtab.highlight()
            this.hdtab.init()
            this.sidetab = new hdtab({
                container: $('sidetabs')
            })
            this.sidetab.highlight()
            this.sidetab.init()
            this.search = new window.Search(getElementById('search'));
            this.initLoginStatus();
        },
        getTabIndex: function() {},
        initLoginStatus: function() {
            ajax({
                url: '/api/users?getloginuser',
                success: function(data) {
                    if (data.code === 200) {
                        this.initUserInfo(data.result);
                    }
                }.bind(this),
                fail: function() {}
            })
        },
        initUserInfo: function(data) {
            // 设置用户姓名和性别icon
            this.nName.innerText = data.nickname;
            addClass(this.nSexIcon, iconConfig[data.sex]);


            // 隐藏登陆，注册按钮显示用户信息
            addClass(this.nGuest, 'f-dn');
            delClass(this.nUser, 'f-dn')
        },
    }
    nav.init()
    window.nav = nav;
})(window.App);
(function(App) {
    // function html2node(str) {
    //     var container = document.createElement('div');
    //     container.innerHTML = str;
    //     return container.children[0];
    // }
    // 轮播图
    var template = `<div class="m-slider"></div>`;

    function Slider(options) {
        extend(this, options);
        // thi.container = getElementByClassName('g-banner')[0];

        // var banner = document.getElementsByClassName('g-banner');
        // banner.createElement(html2node(template));
        // 组件节点
        this.slider = html2node(template);
        this.sliders = this.buildSlider();
        this.cursors = this.buildCursor();
        // 初始化事件
        this.slider.addEventListener('mouseenter', this.stop.bind(this));
        this.slider.addEventListener('mouseleave', this.autoPlay.bind(this));
        // 初始化动画
        this.container.appendChild(this.slider);
        this.nav(this.initIndex || 0);
        this.autoPlay();

    }
    Slider.prototype.buildSlider = function() {
        var img = document.createElement('ul'),
            html = '';
        for (var i = 0; i < this.length; i++) {
            html += '<li class="slider_img"><img src="../res/images/banner/banner${i+1}.jpg"></li>';
        }
        img.innerHTML = html;
        this.slider.appendChild(img);
        cursor.addEventListener('mouseenter', function(event) {
            // index = 获取下标
            // this.nav(index)
        }.bind(this))
    }
    Slider.prototype.buildCursor = function() {
            var cursor = document.createElement('ul'),
                html = '';
            cursor.className = 'm-cursor';
            for (var i = 0; i < this.length; i++) {
                html += '<li data-index=${i}></li>';
            }
            cursor.innerHTML = html;
            this.slider.appendChild(cursor);
            // 处理点击事件
            cursor.addEventListener('click', function(event) {
                // index = 获取下标
                // this.nav(index)
            }.bind(this))
            return cursor.children;
        }
        // 下一页
    Slider.prototype.next = function() {
            var index = (this.index + 1) % this.imgLength;
            this.nav(index)
        }
        // 跳到指定页
    Slider.prototype.nav = function(index) {
            if (this.index === index) return;
            this.last = this.index;
            this.index = index;

            this.fade();
            this.setCurrent();
        }
        // 设置当前选中状态
    Slider.prototype.setCurrent = function() {
            // 去除之前选中节点的选中状态
            // 添加当前选中节点的选中状态 
            // _.addClassName(this.nGuest, 'z-active');
            // _.addClassName(this.nUser, 'z-active')
        }
        // 自动播放
    Slider.prototype.autoPlay = function() {
            this.timer = setInterval(function() {
                this.next();
            }.bind(this).this.interval)
        }
        // 停止自动播放
    Slider.prototype.stop = function() {
            clearInterval(this.timer)
        }
        // 切换效果
    Slider.prototype.fade = function() {
        if (this.last !== undefined) {
            this.sliders[this.last].style.opacity = 0;
        }
        this.sliders[this.index].style.opacity = 1;
    }
    window.Slider = Slider;

})(window.App);
// 明日之星
(function(App) {
    function StarList(container, data) {
        this.listInfo = data;
        this.container = container;
        // 绑定事件
        this.container.addEventListener('click', this.followHandler.bind(this));
        this.render(data);
    }
    extend(StarList.prototype, window.emitter);
    StarList.prototype.render = function(data) {
        var html = ''
        data.forEach(function(item) {
            html += this.renderItem(item);
        }.bind(this))
        this.container.innerHTML = html;
    }
    StarList.prototype.renderItem = function(data) {
        var config = followConfig[Number(!!data.isFollow)];
        var html = `
            <li class="m-card">
                <img src="/res/images/avatar.jpg" alt="" class="card_avatar">
                <div class="card_info">
                    <div>${data.nickname}</div>\
                    <div><span>作品 ${data.workCount}</span><span>粉丝 ${data.followCount}</span></div>
                </div>
                <button class="u-btn u-btn-sm u-btn-primary z-follow" data-userid='${data.id}'>
                    <span class="u-icon ${config.icon}"></span>${config.text}
                </button>
            </li>`;
        return html;
    }
    StarList.prototype.followHandler = function(event) {
        var target = event.target;
        if (event.target.tagName === 'BUTTON') {
            var user = window.user;
            // 未登录
            if (user.username === undefined) {
                this.emit('login');
                return;
            }
            // 已登录
            var userId = target.dataset.userid,
                data;
            // data=点击的用户信息
            if (hasClass(target, 'z-unfollow')) {
                this.follow(data, target.parentNode);
            } else {
                this.unFollow(data, target.parentNode);
            }
        }
    }
    StarList.prototype.follow = function(followInfo, replaceNode) {
        ajax({
            url: 'api/user?follow',
            method: 'POST',
            data: {
                id: followInfo.id
            },
            success: function(data) {
                if (data.code == 200) {
                    followInfo.isFollow = true;
                    followInfo.followCount++;
                    var newNode = html2node(this.renderItem(followInfo));
                    replaceNode.parentNode.replaceNode(newNode, replaceNode);
                }
            }.bind(this),
            fail: function() {}
        })
    }
    StarList.prototype.unfollow = function(followInfo, replaceNode) {
        ajax({
            url: 'api/user?unfollow',
            method: 'POST',
            data: {
                id: followInfo.id
            },
            success: function(data) {
                if (data.code == 200) {
                    followInfo.isFollow = false;
                    followInfo.followCount++;
                    var newNode = html2node(this.renderItem(followInfo));
                    replaceNode.parentNode.replaceNode(newNode, replaceNode);
                }
            }.bind(this),
            fail: function() {}
        })
    }
    window.StarList = StarList;
})(window.App)

// 通用modal
(function(App) {
    // Modal
    // -------

    var template =
        `<div class="m-modal">
                <div class="modal_align"></div>
                <div class="modal_wrap">
                    <div class="modal_head">
                        <a class ="u-icon u-icon-close cancel"></a>
                    </div>
                    <div class="modal_body"></div>
                    <div class="modal_foot"></div>
                </div>
            </div>`;

    function Modal(options) {
        options = options || {};
        // 即 div.m-modal 节点
        this.container = this._layout.cloneNode(true);
        // body 用于插入自定义内容
        this.body = this.container.querySelector('.modal_body');
        // 标题节点
        this.head = this.container.querySelector('.modal_head');
        this.foot = this.container.querySelector('.modal_foot');
        // 将options 复制到 组件实例上
        extend(this, options);
        this.init();
    }
    extend(Modal.prototype, {
        _layout: html2node(template),
        setContent: function(content) {
            if (!content) return;
            //支持两种字符串结构和DOM节点
            if (content.nodeType === 1) {
                this.body.innerHTML = 0;
                this.body.appendChild(content);
            } else {
                this.body.innerHTML = content;
            }
        },
        // 显示弹窗
        show: function(content) {
            if (content) this.setContent(content);
            document.body.appendChild(this.container);
        },
        hide: function() {
            var container = this.container;
            document.body.removeChild(container);
        },
        // 初始化事件
        init: function() {
            this.container.querySelector('.cancel').addEventListener(
                'click', this._onCancel.bind(this)
            );
        },
        _onCancel: function() {
            this.emit('cancel')
            this.hide();
        }

    })
    extend(Modal.prototype, emitter);
    window.Modal = Modal;
}());
// 登录modal
(function(App) {
    // var LoginModal = window.Modal();
    // var validator = window.validator;
    var html =
        `<div>\
            <div class="modal_tt"><strong>欢迎回来 </strong><span>还没有账号？<a class="u-link" id="goregister">立即注册</a></span></div>
            <form action="" class="m-form m-form-1" id="loginform">
                <div class="u-formitem"><input type="text" id="username" placeholder="手机号" class="formitem_ct u-ipt"></div>
                <div class="u-formitem u-formitem-1"><input type="password" id="password" placeholder="密码" class="formitem_ct u-ipt"></div>
                <div class="u-formitem u-formitem-2">
                    <label for="remember" class="u-checkox u-checkbox-remember">
                        <input type="checkbox" id="remember">
                        <i class="u-icon u-icon-checkbox"></i>
                        <i class="u-icon u-icon-checkboxchecked"></i>
                        <span>保持登录</span>
                    </label>
                    <span class="f-fr">忘记密码？</span>
                </div>
                <div class="u-error f-dn"><span class="u-icon u-icon-error"></span><span id="errormsg"></span></div>
                <button class="u-btn u-btn-primary u-btn-st" type="submit">登&nbsp;&nbsp;录</button>
            </form>
        </div>`

    function LoginModal() {
        this.node = html2node(html);
        window.Modal.call(this, {});
        // 缓存节点 this.username...
        this.nForm = $('loginform');
        this.nUsername = $('username');
        this.nPassword = $('password');
        this.nError = $('errormsg');
        this.nRemember = $('remember');
        this.nLogin = $('login');
        this.initLoginEvent();
    }
    LoginModal.prototype = Object.create(window.Modal.prototype);
    LoginModal.prototype.initLoginEvent = function() {
        // 绑定提交事件
        // 绑定跳转注册事件
        var nLogin = document.getElementById('login');
        $('goregister').addEventListener('click', function() {
            this.emit('register');
        }).bind(this)
        this.nLogin.addEventListener('click', function() {
            this.modal = new window.LoginModal();
            this.modal.on('ok', function(data) {
                this.initUserInfo(data);
                this.loginCallback && this.loginCallback(data);
            }.bind(this))
            this.modal.on('register', function() {
                this.modal.hide();
                this.nRegister.click();

            }.bind(this))
        }.bind(this));
    }
    LoginModal.prototype.check = function() {
        var isValid = true,
            flag = true;
        // 验证用户名
        flag = flag && !isEmpty(this.nUsername.value);
        flag = flag && isPhone(this.nUsername.value);
        !flag && this.showError(this.nUsername, true);
        isValid = isValid && flag;
        // 密码
        flag = true;
        flag = flag && isEmpty(this.nPassword.value);
        !flag && this.showError(this.nPassword.value);
        isValid = isValid && flag;
        // 错误
        return isValid;
    }
    LoginModal.prototype.submit = function(event) {
        event.preventDefaul();
        if (this.check()) {
            var data = {
                username: this.nUsername.value.trim(),
                password: hex_md5(this.nPassword.value),
                remember: !!this.nRemember.checked
            };
            ajax({
                url: '/api/login',
                method: 'POST',
                data: data,
                success: function(data) {
                    if (data.code === 200) {
                        this.hide();
                        this.emit('ok', data.result)
                    } else {
                        switch (data.code) {
                            case 400:
                                this.nError.innerText = '密码错误，请重新输入'
                                break;
                            case 404:
                                this.nError.innerText = '用户不存在，请重新输入'
                                break;
                        }
                        this.showError(this.nForm, true);
                    }
                }.bind(this),
            });
        }
    }
    $('login').addEventListener('click', function() {
        show(node);
    })
    window.LoginModal = LoginModal;
})(window.App);

// 注册
(function(App) {
    var html = `<div><img src="" alt=""></div>
                <form action="" class="m-form" id="registerform">
                    <div class="u-formitem">
                        <label for="phone" class="formitem_tt">手机号</label>
                        <input type="text" name="phone" id="phone" placeholder="请输入11位手机号码" class="foritem_ct u-ipt">
                    </div>
                    <div class="u-formitem">
                        <label for="username" class="formitem_tt">昵称</label>
                        <input type="text" name="username" id="nickname" placeholder="中英文均可，至少6个字符" class="foritem_ct u-ipt">
                    </div>
                    <div class="u-formitem">
                        <label for="password" class="formitem_tt">密码</label>
                        <input type="text" name="password" id="password" placeholder="长度6-16个字符，不包含空格" class="foritem_ct u-ipt">
                    </div>
                    <div class="u-formitem">
                        <label for="password1" class="formitem_tt">确认密码</label>
                        <input type="text" name="password1" id="password1" placeholder="长度6-16个字符，不包含空格" class="foritem_ct u-ipt">
                    </div>
                    <div class="u-formitem">
                        <label for="" class="formitem">生日</label>
                        <div class="u-formitem">
                            <div class="m-cascadeselect" id="birthday"></div>
                        </div>
                    </div>
                    <div class="u-formitem">
                        <label for="" class="formitem">所在地</label>
                        <div class="u-formitem">
                            <div class="m-cascadeselect" id="location"></div>
                        </div>
                    </div>
                    <div class="u-error f-dn">
                        <span class="u-icon-errror"></span><span id="errormsg"></span>
                    </div>
                    <but class="u-btn u-btn-primary" type="submit">注&nbsp;&nbsp;册</but>
                </form>`

    function RegisterModal() {
        this.node = html2node(html);
        window.Modal.call(this, {});
        // 缓存节点 this.nPhone
        // ...
        this.nPhone = $('phone');
        this.nNickname = $('nickname');
        this.nPassword = $('password');
        this.initSelect();
        this.initRegisterEvent();
    }
    RegisterModal.prototype = Object.create(window.Modal.prototype);
    RegisterModal.prototype.initRegisterEvent = function() {}
    RegisterModal.prototype.initSelect = function() {}
    RegisterModal.prototype.resetCaptcha = function() {}
    RegisterModal.prototype.submit = function() {
        // ...
        if (this.check()) {
            var data = {
                username: this.phone.value.trim(),
                nickname: this.nick.value.trim(),
                password: hex_md5(this.pwd.value),
                sex: this.getRadioValue('registerform', 'sex'),
                captcha: this.captcha.value.trim()
            };
            ajax({
                url: '/api/register',
                method: 'POST',
                data: data,
                success: function(data) {
                    if (data.code === 200) {
                        this.hide();
                        this.emit('ok');
                    } else {
                        this.nError.innerText = data.msg;
                        this.showError(this.nForm, true);
                    }
                }.bind(this),
                fail: function() {}
            })
        }
    }
    RegisterModal.prototype.checkRules = function(checkRules) {
        // ...
        for (var i = 0; i < checkRules.length; i++) {
            var checkItem = checkRules[i][0],
                rules = checkRules[i][1],
                flag;
            for (var j = 0; j < rules.length; j++) {
                var key = rules[j];
                switch (key) {
                    case 'nickname':
                        flag = validator.isNickName(checkItem.value);
                        break;

                    case 'length':
                        flag = validator.isLength(checkItem.value, 6, 16);
                        break;
                }
                if (!flag) { break; }
            }

        }
    }
    RegisterModal.prototype.check = function() {
            var isValid = true,
                errorMsg = '';
            var checkList = [
                [this.phone, ['required', 'phone']],
                [this.nick, ['required', 'nickname']],
                [this.pwd, ['required', 'length']],
                [this.confirmpwd, ['required', 'length']],
                [this.captcha, ['required']]
            ]
            isValid = this.checkRules(checkList);
            if (!isValid) {
                errorMsg = '输入有误';
            }
            // 验证两次密码
            // 验证条款是否为空
            // 显示错误
            return isValid;
        }
        // ...
    window.RegisterModal = RegisterModal;
})(window.App);
// select
(function(App) {
    // var _ = App.util;
    var html = '<div class="m-select"></div>'

    function Select(options) {
        extend(this.options);
        this.body = html2node(html);
        // 缓存节点 this.selection
        this.init()
    }
    extend(Select.prototype, window.emitter);
    Select.prototype.init = function() {}
    Select.prototype.initEvent = function() {
        this.body.addEventListener('click', this.clickHandler.bind(this));
        document.addEventListener('click', this.close.bind(this));
    }
    Select.prototype.render = function(data, defaultIndex) {
        var optionsHTML = '';

        for (var i = 0; i < data.length; i++) {
            // 格式化数据{name:value;}
            optionsHTML += '<li data-index=${i}>${data[i].name}</li>'
        }
        this.nOption.innerHTML = optionsHTML;
        this.nOptions = this.nOption.children;
        this.options = data;
        this.selectedIndex = undefined;
        // 默认选中第一项
        this.setSelect(defaultIndex || 0);
    }
    Select.prototype.clickHandler = function(event) {
        // this.setSelect() or this.toggle();
    }
    Select.prototype.open = function() {
        delClass(this.nOption, 'f-dn');
    }
    Select.prototype.close = function() {
        addClass(this.nOption, 'f-dn')
    }
    Select.prototype.toggle = function() {
        hasClass(this.nOption, 'f-dn') ? this.open() : this.close();
    }
    Select.prototype.getValue = function() {
        return this.options[this.selectedIndex].value;
    }
    Select.prototype.setSelect = function(index) {
        if (this.selectedIndex !== undefined) {
            delClass(this.nOption[this.selectedIndex], 'z-select');
        }
        this.selectedIndex = index;
        this.nValue.innerText = this.options[this.selectedIndex].name;
        addClass(this.nOption[tthis.selectedIndex], 'z-select')

        this.emit('select', this.getValue());
    }
    window.Select = Select;
})(window.App);
(function(App) {
    function CascadeSelect(options) {
        extend(this, options)
        this.selectList = [];
        this.init();
    }
    CascadeSelect.prototype.init = function() {
        for (var i = 0; i < 3; i++) {
            var select = new window.Select({
                container: this.container
            });
            select.on('select', this.onChange.bind(this, i))
            this.selectList[i] = select;
        }
        this.selectList[0].render(this.data);
    }
    CascadeSelect.prototype.getValue = function() {}
        // 响应select事件，渲染下一个select数据
    CascadeSelect.prototype.onChange = function(index) {
            var next = index + 1;
            if (next === this.selectList.length) return;
            this.selectList[next].render(this.getList(next));
        }
        // 获取第n个select数据
    CascadeSelect.prototype.getList = function(n) {}
    window.CascadeSelect = CascadeSelect;
})(window.App);

// 首页
(function() {
    var page = {
        init: function() {
            this.initNav();
            this.StarList();
            this.slider = new window.Slider({
                container: document.getElementsByClassName('g-banner'),
                imgList: [
                    '../res/images/banner/banner0.jpg',
                    '../res/images/banner/banner1.jpg',
                    '../res/images/banner/banner2.jpg',
                ]
            });
            this.sideTab = new window.Tabs({
                container: $('sidetabs')
            });
        },
        initNav: function(arguments) {
            window.nav.init({
                login: function(data) {
                    if (!window.user.username) {
                        window.user = data;
                        this.initStarList();
                    }
                }.bind(this)
            })
        },
        initStarList: function() {
            ajax({
                url: '/apiuser?getstarlist',
                success: function(data) {
                    if (data.code === 200) {
                        if (!this.starList) {
                            this.starList = new window.StarList($('sarlist'), data.result);
                            this.starList.on('login', function() {
                                this.na.showLogin();
                            }.bind(this))
                        } else {
                            this.starList.render(data.result);
                        }
                    }
                }.bind(this),
                fail: function() {}
            })
        }
    };
    document.addEventListener('DOMContentLoaded', function(e) {
        page.init();
    })
}())