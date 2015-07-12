# MPreview.js

Word，PPT 文档预览组件（图片预览组件）

移动端请移步 [MPreview.mobile](https://github.com/webjyh/MPreview.mobile)

## Demo参考

<http://demo.webjyh.com/MPreview/>

### 特此说明
此插件是我在项目开发中而制作，其只适用于其项目，如须使用须注意，提供的图片须有较大的宽高。

### 插件说明
1. 此插件需要由服务端提供转换好的Word图片或PPT图片来进行预览。
2. 插件需要 jQuery1.9+ 库。支持IE7+，FireFox，Chrome。
3. 初始化调用插件的外容器，只需设置宽高样式即可，无需其它设置。
4. 因插件是刚开始阶段，一些功能并未能完善全，如：放大，缩小功能。
5. 插件中一些滚动的计算是硬算出来的(勿喷)。

### 插件特性
1. 服务端将全数据返回(图像地址的数组集合)，由插件进行分割加载。
2. 支持滚动条拖拽滚动及全屏预览。
3. 支持上一页，下一页功能。

### 目录结构说明
```
MPreview/
├── css/
│   ├── base.css               (重置样式)
│   └── MPreview.css           (插件所需样式)
├── images/
│   ├── loading.gif            (加载图片等待动画)
│   └── media_icon.png         (插件所需的icon)
├── js/
│   ├── MPreview.js            (Word版 js)
│   └── MPreviewPPT.js         (PPT版 js)
├── upload/
│   ├── MPreview_DOC_1.jpg     (测试图片)
│   └── MPreview_PPT_1.jpg
├── api.php                     (数据请求的演示地址)
├── data.json                   (请求所返回的数据格式)
├── index.html                  (Word版 Demo)
└── PPT.html                    (PPT版 Demo)

PS: 务必一次性返回所有图片地址，插件将自动分割加载
```

### 如何使用
```html
<!-- require css -->
<link rel="stylesheet" href="css/MPreview.css">

<!-- require js -->
<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="js/MPreview.js"></script>

<!-- html -->
<div class="doc" id="doc"></div>
<script type="text/javascript">
    $('#doc').MPreview({ url: 'api.php?action=doc&callback=?' });
</script>
```

### MPreview.js (Word 版) 参数说明
```javascript
$('#doc').MPreview({ 
    url: 'api.php?action=doc&callback=?',   //url中包含callback则表示跨越请求，具体可参考$.getJSON();
	data: null,                             //包含所有图片地址的数组，如填写则不发送Ajax。用于直接传入数据，方便调用。
	offset: 100,                            //每次滚动偏移多少像素，默认 100px
	loadSize: 5,                            //每次加载几张图片
	pageFix: 50,                            //当前页数判定的衡量标准
	scrollFix: 5,                           //当前默认滚动条距离外容器的边距
	minScrollHeight: 20                     //当前滚动条按钮最小高度
});

//关于 data 参数的用法
var data = ['upload/1.jpg','upload/2.jpg','upload/3.jpg'];
$('#doc').MPreview({ data: data });
```

### MPreviewPPT.js (PPT 版) 参数说明
```javascript
$('#ppt').MPreviewPPT({ 
    url: 'api.php?action=doc&callback=?',   //url中包含callback则表示跨越请求，具体可参考$.getJSON();
	data: null,                             //包含所有图片地址的数组，如填写则不发送Ajax。用于直接传入数据，方便调用。
	loadSize: 5,                            //每次加载几张图片
	scrollFix: 5,                           //当前默认滚动条距离外容器的边距
	minScrollHeight: 20                     //当前滚动条按钮最小高度
});

//关于 data 参数的用法
var data = ['upload/1.jpg','upload/2.jpg','upload/3.jpg'];
$('#ppt').MPreviewPPT({ data: data });
```

### 联系作者
Blog：<http://webjyh.com> 
Weibo：<http://weibo.com/webjyh/>
