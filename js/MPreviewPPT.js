/**
 * @name     MPreviewPPT.js
 * @desc     幻灯片预览。
 * @depend   jQuery 1.7+, jQuery.MouseWheel.js
 * @author   M.J
 * @date     2014-12-31
 * @URL      http://webjyh.com
 * @reutn    {jQuery}
 * @version  1.0.0
 *
 * @PS If you have any questions, please don't look for me, I don't know anything. thank you.
 */
(function($) {
    var MPreviewPPT = function(elem, option) {

        this.config = $.extend({}, this.defaults, option);

        this.elem = $(elem);            //绑定的元素
        this.page = 0;                  //当前页
        this.bout = 0;                  //当前滚动的总次数
        this.btnOffset = 0;             //当前滚动按钮每次滚动的距离
        this.length = 0;                //当前数据的总长度也是总页数
        this.data = [];                 //当前所有数据
        this.W = [];                    //存放所有图片容器距外容器左边的距离
        this.DOM = this.__createDOM();  //当前所有元素DOM
        this.S = {                      //存放当前容器的宽，高
            width: this.elem.width(),
            height: this.elem.height(),
            viewWidth: this.DOM.mediaPlay.width(),
            viewHeight: this.DOM.mediaPlay.height()
        };

        this.__init();

    };


    MPreviewPPT.prototype = {
        /**
         * 默认配置
         * @type {Object}
         */
        defaults: {
            url: null,                //默认Ajax地址
            data: null,               //默认JSON 格式的数据，如填写则不发送Ajax，默认为 {Array} 类型
            loadSize: 5,              //默认先创建几页
            scrollFix: 5,             //当前默认滚动条距离外容器的边距
            minScrollWidth: 20       //当前滚动条按钮最小高度
        },

        /**
         * @access   private
         * @name     执行请求
         * @return   {this}
         */
        __init: function() {
            var _this = this, DOM = this.DOM;
            
            if ( this.config.data && this.config.data.length ){
                this.__set(this.config.data).__create().__addEvent();
            } else {
                $.getJSON(this.config.url)
                 .done(function(data) {
                    if (data.code > 0 && data.imgs.length) {
                        _this.__set(data.imgs).__create().__addEvent();
                    }
                 })
                 .fail(function() {
                    alert('\u83b7\u53d6\u6570\u636e\u5931\u8d25');
                 });
            }

            return this;
        },
        
        /**
         * @access   private
         * @name     首次数据进行设置
         * @return   {Object}
         */
        __set: function(data) {
            var DOM = this.DOM;
            
            this.data = data;
            this.length = data.length;
            
            DOM.pageInput.val('01');
            DOM.pageCount.children('em').text(this.__formatNumber(this.length));
            if (this.length > 1) DOM.pageNext.addClass('current');
            
            return this;
        },
        
        /**
         * @access   private
         * @name     创建list
         * @return   {Object}
         */
        __create: function() {
            if (!this.data.length) return false;
            $(document).off('mousemove');
            
            var i = 0,
                tpl = '',
                len = this.data.length,
                count = len > this.config.loadSize ? this.config.loadSize : len,
                DOM = this.DOM,
                size = this.__getSize();

            // create TPL && delete array
            for (; i<count; i++) {
                var W = (typeof this.W[this.W.length-1] === 'undefined' ? 0 : this.W[this.W.length-1]) + size.width;
                this.W.push(W);
                tpl += MPreviewPPT.tpl.replace('{src}', this.data.shift());
            }
            
            $(tpl).appendTo(DOM.mediaView).width(size.width).find('img').height(size.height);
            DOM.mediaView.css('width', this.W[this.W.length-1]);
            this.bout = this.W.length-1;

            this.__scrollBar();
            
            return this;
        },
        
        /**
         * @access   private
         * @name     设置滚动
         * @return   {Object}
         */
        __scrollBar: function() {
            var DOM = this.DOM,
                _this = this,
                size = this.__getSize();
            
            if (this.length < 2) {
                DOM.scrollBar.hide();
                return false;
            }

            //计算总个数滚动条
            var btnWidth = ((size.width - this.config.scrollFix * 2) / this.W[this.W.length-1]) * size.width;
            this.btnOffset = (size.width - this.config.scrollFix * 2  - btnWidth) / this.bout;

            //默认设置DOM
            DOM.scrollBtn.width(btnWidth <= this.config.minScrollWidth ? this.config.minScrollWidth : btnWidth);
            DOM.scrollBtn.css('left', this.btnOffset * this.page + this.config.scrollFix);
            
            var scroll = function(val) {
            
                // 计算设置滚动偏差
                val == 'up' ? ++_this.page : --_this.page;
                if (_this.page < 0) _this.page = 0;
                if (_this.page > _this.bout)  _this.page = _this.bout;
                
                var m = (typeof _this.W[_this.page-1] === 'undefined' ? 0 : _this.W[_this.page-1]),
                    t = _this.page * _this.btnOffset;
                
                //设置滚动条
                DOM.mediaView.css('margin-left', -m);
                DOM.scrollBtn.css('left', t + (val == 'up' ? 0 : _this.config.scrollFix)); 
                
                //设置当前页
                DOM.pageInput.val(_this.__formatNumber(_this.page+1));
                
                //创建剩余数据
                _this.__createLastData();
                
            };

            //滚动事件绑定
            DOM.mediaPlay.off('mousewheel').on('mousewheel', function(event) {
                event.preventDefault();
                scroll(event.deltaY < 0 ? 'up' : 'down');
            });

            return this;
        },
        
        /**
         * @access   private
         * @name     给元素绑定相应的事件
         * @return   {Object}
         */
        __addEvent: function() {
            var DOM = this.DOM,
                _this = this;
                
            var arrowOver = function(){
                if (_this.page > 0) DOM.arrowTop.stop(true,true).fadeIn();
                if (_this.page < _this.length -1) DOM.arrowBottom.stop(true,true).fadeIn();
            };
            
            var arrowOut = function(){
                DOM.arrowTop.stop(true,true).fadeOut();
                DOM.arrowBottom.stop(true,true).fadeOut();
            };
            
            //拖拽事件
            DOM.scrollBtn.on('mousedown', function(event) { _this.__dragStart(event) });
            
            //页码按钮显示
            DOM.arrowUp.on('mouseover', arrowOver);
            DOM.arrowDown.on('mouseover', arrowOver);
            DOM.arrowUp.on('mouseout', arrowOut);
            DOM.arrowDown.on('mouseout', arrowOut);
            
            //上一页，下一页事件
            DOM.arrowTop.on('click', function() { _this.__pageJump('up') });
            DOM.pagePrev.on('click', function() { _this.__pageJump('up') });
            DOM.arrowBottom.on('click', function() { _this.__pageJump('down') });
            DOM.pageNext.on('click', function() { _this.__pageJump('down') });

            //全屏操作
            DOM.fullScreen.on('click', function() { _this.__full(); });
            DOM.mediaPlay.on('dblclick', function() { _this.__full(); });
            
            return this;
        },
        
        /**
         * @access   private
         * @name     滚动条拖拽开始
         * @return   {Object}
         */
        __dragStart: function(event) {
            var _this = this,
                DOM = this.DOM,
                fix = Math.floor(event.clientX - DOM.scrollBtn.offset().left);

            $(document).on('mousemove', function(event) { _this.__dragDrop(event, fix) });
            $(document).off('mouseup').on('mouseup', function() { $(this).off('mousemove') });
        },
        
        /**
         * @access   private
         * @name     滚动条拖拽
         * @return   {Object}
         */
        __dragDrop: function(event, fix) {
            var DOM = this.DOM,
                size = this.__getSize(),
                defaultLeft = parseInt(DOM.scrollBtn.css('left'), 10),
                W = Math.floor(event.clientX - DOM.scrollBtn.offset().left - fix + defaultLeft),
                minW = this.config.scrollFix,
                maxW = size.width - DOM.scrollBtn.outerWidth() - minW;

            if ( W < minW ) W = minW;
            if ( W > maxW ) W = maxW;
            
            //设置当前页
            var page = Math.floor(W / this.btnOffset), M;
            this.page = page > this.bout ? this.bout : page;
            M = (typeof this.W[this.page-1] === 'undefined' ? 0 : this.W[this.page-1]);
            
            DOM.mediaView.css('margin-left', -M );
            DOM.scrollBtn.css('left', W);
            
            //设置当前页
            DOM.pageInput.val(this.__formatNumber(this.page+1));
            
            //创建剩余数据
            this.__createLastData();
        },
        
        /**
         * @private   private
         * @param     页码跳转
         * @return    {null}
         */
        __pageJump: function(val) {

            //设置当前页码
            val == 'up' ? --this.page : ++this.page;
            if (this.page < 0) this.page = 0;
            if (this.page > this.length-1 ) this.page = this.length-1;

            //计算滚动值
            var DOM = this.DOM,
                size = this.__getSize(),
                M = typeof this.W[this.page-1] === 'undefined' ? 0 : this.W[this.page-1],
                btnL = this.page * this.btnOffset,
                minW = this.config.scrollFix,
                maxW = size.width - DOM.scrollBtn.outerWidth() - minW;
            
            if ( btnL < minW ) btnL = minW;
            if ( btnL > maxW ) btnL = maxW;

            //设置DOM
            DOM.pageInput.val(this.__formatNumber(this.page+1));
            DOM.mediaView.css('margin-left', -M);
            DOM.scrollBtn.css('left', btnL);
 
            //创建剩余数据
            this.__createLastData();
        },
        
        __full: function(bool) {
            var $elem = this.elem,
                DOM = this.DOM,
                _this = this,
                has = DOM.fullScreen.hasClass('MPreview-exit'),
                winH = $(window).outerHeight();
            
            //用于 resize 事件
            if ( bool ) has = false;
            
            // 全屏样式
            var css = {
                    position: has ? 'static' : 'fixed',
                    top: has ? 'auto' : 0,
                    left: has ? 'auto' : 0,
                    zIndex: has ? '0' : 9999,
                    width: has ? this.S.width : '100%',
                    height: has ? this.S.height : winH
                },
                bodyCss = {
                    overflow: has ? 'auto' : 'hidden',
                    width: has ? 'auto' : '100%',
                    height: has ? 'auto': winH
                };
            
            //设置DOM样式
            DOM.fullScreen[has ? 'removeClass' : 'addClass']('MPreview-exit').attr('title', has ? '\u5168\u5c4f' : '\u53d6\u6d88\u5168\u5c4f');
            $('html').css(bodyCss);
            $elem.css(css);
            
            var winW = DOM.mediaPlay.width();
            
            //重新设置全局数据
            this.W = [];
            DOM.mediaView.children('div').each(function() {
                $(this).width(has ? _this.S.viewWidth : winW);
                $(this).children('img').height(has ? _this.S.viewHeight : winH);
                var W = (typeof _this.W[_this.W.length-1] === 'undefined' ? 0 : _this.W[_this.W.length-1]) + (has ? _this.S.viewWidth : winW);
                _this.W.push(W);
            });

            DOM.mediaView.css('width', this.W[this.W.length-1]);
            DOM.mediaView.css('margin-left', -(typeof this.W[this.page-1] === 'undefined' ? 0 : this.W[this.page-1]));
            this.__scrollBar();
            
            //绑定事件
            if ( has ){
                $(document).off('keyup');
                $(window).off('resize');
            } else {
                $(document).on('keyup', function(event){ if (event.which == 27) _this.__full(); });
                $(window).off('resize').on('resize', function(){ _this.__full(true); })
            }

        },
        
        /**
         * @private   private
         * @param     给单数字自动补零
         * @return    {String}
         */
        __formatNumber: function(val) {
            return val.toString().length < 2 ? '0' + val : val;
        },
        
        /**
         * @private   private
         * @param     设置页码样式及判断是否创建剩余数据
         * @return    {null}
         */
        __createLastData: function() {
            var DOM = this.DOM;

            DOM.pagePrev[this.page > 0 ? 'addClass' : 'removeClass']('current');
            DOM.pageNext[this.page < this.length - 1 ? 'addClass' : 'removeClass']('current');
            
            if ( this.page >= Math.floor( this.bout ) - 1) this.__create();
        },

        /**
         * @access   private
         * @name     创建DOM，存储DOM
         * @return   {Object}
         */
        __createDOM: function() {
            var $elem = this.elem, DOM = {}, elem;

            DOM['wrap'] = $(MPreviewPPT.template).appendTo($elem);
            DOM.wrap.find('*').each(function() {
                var className = $(this).attr('class');
                if ( className !== undefined && className.toString().indexOf('MPreview') > -1 ) {
                    var name = className.replace(/icon /g, '').replace('MPreview-', '');
                    DOM[name] = $(this);
                }
            });

            return DOM;
        },
        
        /**
         * @access   private
         * @name     获取 DOM size
         * @return   {Object}
         */
        __getSize: function() {
            var DOM = this.DOM;
            return {
                width: DOM.mediaPlay.width(),
                height: DOM.mediaPlay.height()
            };
        }
    };

    MPreviewPPT.tpl = '<div><img src="{src}" /></div>'

    MPreviewPPT.template = '<div class="MPreview-box MPreview-ppt"><div class="tool-bar clefix"><ul class="clefix"><li><a href="javascript:void(0);" class="MPreview-fullScreen"><span>\u5168\u5c4f</span></a></li></ul></div><div class="MPreview-scrollBar"><div class="MPreview-scrollBtn"></div></div><div class="MPreview-mediaPlay"><div class="MPreview-mediaView"></div></div><div class="page-bar"><div class="page-bar-inner clefix"><a href="javascript:void(0);" class="MPreview-pagePrev"><span>\u4e0a\u4e00\u9875</span></a> <input type="text" name="page" class="MPreview-pageInput" value="0" disabled maxlength="5"> <span class="MPreview-pageCount">/&nbsp;&nbsp;<em>0</em></span> <a href="javascript:void(0);" class="MPreview-pageNext"><span>\u4e0b\u4e00\u9875</span></a></div></div><div class="MPreview-arrowUp"><div href="javascript:void(0);" class="MPreview-arrowTop"><span>\u4e0a\u4e00\u9875</span></div></div><div class="MPreview-arrowDown"><div href="javascript:void(0);" class="MPreview-arrowBottom"><span>\u4e0b\u4e00\u9875</span></div></div></div>';

    $.fn.MPreviewPPT = function(option) {
        return this.each(function() {
            new MPreviewPPT(this, option);
        });
    };

})(jQuery);


/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));