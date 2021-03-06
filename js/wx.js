(function () {
    var sc ;
    function n(a, b, c, d) {
        this.parent = a;
        this.type = b || 0;
        this.x = c || 0;
        this.y = d || 0;
        this._y = this._x = 0;
        this.ele = document.createElement("div");
        this.check = !1;
        this.ele.className = "block_" + b;
        this.parent.stageObj.appendChild(this.ele);
        var e = this;
        this.ele.ontouchstart = function () {
            this.onclick = null;
            e.click();
            e.click();
            return !1
        };
        this.ele.onclick = function () {
            e.click();
            e.click();
            return !1
        };
        this.ele.ondblclick = function () {
            e.parent.select(e)
        };
        this.ele.onselectstart = function () {
            return !1
        }
    }

    function l(a, b) {
        a = Math.round(a);
        b = Math.round(b);
        return Math.round((b - a) * Math.random()) + a
    }

    function t(a) {
        return (a = a.toString().match(/https?\:\/\/.*?([^.]+.(com|net|cn|com\.cn|net\.cn))(\/|$)/)) ? a[1] : ""
    }

    var f = navigator.userAgent.match(/(?:Windows Phone|SymbianOS|Android|iPad|iPod|iPhone)/), f = f ? f[0] : !1,
        k = {};
    window.Games = k;
    window.Games.version = "1.1";
    var r, s;
    k.xiaoxiaokan = function (a) {
        this.selectBlock = this.data = null;
        this.score = 0;
        this.height = this.width = 10;
        var b = document.documentElement.clientWidth / 640;
        f || (b = 1);
        this.itemWidth = 59 * b;
        this.itemHeight = 59 * b;
        this.stageObj = a;
        this.status = "ready"
    };
    k.xiaoxiaokan.prototype = {
        version: "1.0.0", animTime: 300, minGroupSize: 2, level: 4, targetScore: 1E3, score: 0, restart: function () {
            this.selectBlock = [];
            this.setScore(0);
            this.targetScore = localStorage.getItem("xxk_max") || 1E3;
            this.setTargetScoreEle(this.targetScore);
            this.stageObj.style.width = this.width * this.itemWidth + "px";
            this.stageObj.style.height = this.height * this.itemHeight + "px";
            if (1E3 >= this.targetScore) {
                this.maxCB = 6;
                do this.randBlocks(); while (!this._checkEnd(22))
            } else this.maxCB = 5, this.randBlocks();
            this._rewrite();
            this.status = "play";
            document.querySelector("#shareLayer").style.display = "none";
        }, randBlocks: function () {
            this.stageObj.innerHTML = "";
            this.data = [];
            var a, b, c, d, e = l(1, 5);
            for (a = 0; a < this.width; a++) {
                c = [];
                for (b = 0; b < this.height; b++) l(0, this.maxCB) < this.level && (e = l(1, 5)), d = new n(this, e, a, b), c.push(d);
                this.data.push(c)
            }
        }, setScore: function (a) {
            var b = this;
            this.scoreEle && (this.scoreEle.innerHTML = "得分" + a);
            this.score = a;
            sc = a;
            a > this.targetScore && (this.targetScoreEle && (this.targetScoreEle.className = "scoreFlash", clearTimeout(this._ctsTimer), this._ctsTimer = setTimeout(function () {
                b.targetScoreEle.className = ""
            }, 1500)), this.setTargetScoreEle(a))
        }, setTargetScoreEle: function (a) {
            a = parseInt(a) || 1E3;
            this.targetScoreEle && (this.targetScoreEle.innerHTML = "挑战<span>" + a + "</span>分");
            this.targetScore = a;
            1E3 < this.targetScore && localStorage.setItem("xxk_max", this.targetScore)
        }, _rewrite: function () {
            var a, b, c;
            for (a = 0; a < this.data.length; a++) for (b = 0; b < this.data[a].length; b++) !(c = this.data[a][b]) || c.x == c._x && c.y == c._y || (c.ele.style.left = c.x * this.itemWidth + "px", c.ele.style.top = c.y * this.itemHeight + "px", c._x = c.x, c._y = c.y)
        }, select: function (a) {
            if ("play" != this.status) return !1;
            for (var b = 0; b < this.selectBlock.length; b++) this.selectBlock[b].setCheck(!1);
            this.selectBlock = [];
            a = this._friends(a);
            if (!(a.length < this.minGroupSize)) for (this.selectBlock = a, b = 0; b < this.selectBlock.length; b++) this.selectBlock[b].setCheck(!0)
        }, ruin: function (a) {
            if ("play" != this.status) return !1;
            var b = this;
            a = "+" + this.selectBlock.length;
            for (var c = this.selectBlock.length * this.selectBlock.length, d = 0; d < this.selectBlock.length; d++) this.selectBlock[d].ruin(a), this.data[this.selectBlock[d].x][this.selectBlock[d].y] = null;
            this.selectBlock = [];
            this.setScore(this.score + c);
            clearTimeout(this.__timeobjArrange);
            this.__timeobjArrange = setTimeout(function () {
                b.arrange()
            }, this.animTime)
        }, arrange: function () {
            for (var a, b, c = 0; c < this.data.length; c++) {
                a = [];
                for (var d = b = 0; d < this.data[c].length; d++) null == this.data[c][d] ? a.unshift(null) : (b++, a.push(this.data[c][d]));
                0 == b && (a.isNull = !0);
                this.data[c] = a
            }
            a = [];
            for (c = 0; c < this.data.length; c++) this.data[c].isNull || a.push(this.data[c]);
            this.data = a;
            for (c = 0; c < this.data.length; c++) for (d = 0; d < this.data[c].length; d++) this.data[c][d] && (this.data[c][d].x = c, this.data[c][d].y = d);
            this._rewrite();
            1 == this._checkEnd() && this.end("\u6728\u6709\u53ef\u4ee5\u6d88\u7ec4\u5408\u4e86\uff0c\u5c0f\u4f19\u4f34\uff01")
        }, end: function (a) {
            clearInterval(this.__timeobj);
            this.status = "end";
            a = Math.round(100 * Math.sin((this.score - 100) / 1500 * 1.65));
            100 >= this.score && (a = 0);
            1800 <= this.score && (a = 99);
            99 < a && (a = 99);
            r = this.score;
            s = a;
            document.querySelector("#shareLayer").style.display = "block";
            document.querySelector("#shareLayer .gameText").innerHTML = "全球只有0.1%的人能过1500分！<br>您取得了" + this.score + "分<br>超越了" + a + "%的星云链友";
            updateShare(this.score, a);
            Play68.setRankingScoreDesc(this.score);
        }, _friends: function (a) {
            function b(a) {
                var b;
                e.data[a.x - 1] && (b = e.data[a.x - 1][a.y]) && b.type == a.type && c(b);
                e.data[a.x + 1] && (b = e.data[a.x + 1][a.y]) && b.type == a.type && c(b);
                (b = e.data[a.x][a.y - 1]) && b.type == a.type && c(b);
                (b = e.data[a.x][a.y + 1]) && b.type == a.type && c(b)
            }

            function c(a) {
                var b;
                a:{
                    for (b = 0; b < d.length; b++) if (d[b] == a) break a;
                    b = !1
                }
                !1 === b && d.push(a)
            }

            if (!a) return [];
            var d = [], e = this;
            d.push(a);
            for (a = 0; a < d.length; a++) b(d[a]);
            return d
        }, _checkEnd: function (a) {
            a = a || this.minGroupSize;
            for (var b = 0; b < this.data.length; b++) for (var c = 0; c < this.data[b].length; c++) if (this._friends(this.data[b][c]).length >= a) return !1;
            return !0
        }
    };
    n.prototype = {
        click: function () {
            this.parent && (this.check ? this.parent.ruin(this) : this.parent.select(this))
        }, setCheck: function (a) {
            1 == a ? (this.ele.className = this.ele.className.replace(" selected", "") + " selected", this.check = !0) : (this.ele.className = this.ele.className.replace(" selected", ""), this.check = !1)
        }, ruin: function (a) {
            var b = this;
            a && (this.ele.innerHTML = a);
            this.ele.className = "remove";
            setTimeout(function () {
                b.ele.parentNode.removeChild(b.ele)
            }, this.parent.animTime)
        }
    };
    var m = t(location.href);
    m = document.documentElement.clientWidth / 640;
    f && (document.body.style.fontSize = 32 * m + "px");
    var g = new k.xiaoxiaokan(document.getElementById("GameStage"));
    g.scoreEle = document.getElementById("score");
    g.targetScoreEle = document.getElementById("targetScore");
    g.timelimitEle = document.getElementById("timelimit");
    g.restart();
    document.getElementById("reset").onclick = document.getElementById("reset_1").onclick = function () {
        g.restart()
    };
    document.getElementById("submit").onclick = function () {
        console.log("submit")
        submit();

    };


    function submit() {
        //用户昵称 分数
        if(localName){
            callChromeplugins(sc)
        }else{
            alertInputName()
        }
    }
    var SubData={};
    function callChromeplugins() {//调用插件上传数据到链
        SubData.name = localName;
        SubData.score =sc;
        var arrs = [];
        arrs.push(SubData.name);
        arrs.push(SubData.score);

        var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
        var nebPay = new NebPay();
        var value = "0";
        var callFunction = "set"
        var callArgs = JSON.stringify(arrs)

        var serialNumber = nebPay.call(toAddr, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: addSucc        //设置listener, 处理交易返回信息
        });
    }
    function addSucc(resp) {
        alert("分数提交成功");
        getData();
    }
    function  alertInputName() {
        layui.use('layer', function() {
            var $ = layui.jquery, layer = layui.layer;
            layer.prompt({
                formType: 0,
                value: '',
                title: '少侠，留个名字让万人膜拜吧！',
                area: ['250px', '50px'] //自定义文本域宽高
            }, function (value, index) {
                layer.close(index);
                localName = value;
                callChromeplugins();
            });
        })
    }

    /*document.getElementById("shareBtn").onclick=function(){Play68.shareFriend();}*/
})();