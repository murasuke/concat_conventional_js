# モジュール形式ではない古い形式のjsファイルを読み込み順を考慮して結合する

## はじめに

今更ですが、jqueryなどモジュール形式ではないjsファイルを結合して1つにまとめるにはどうすればいいのか？と思い立って調べてみました

Rollupなど新しいバンドラーではモジュール形式ではない古い形式のjsファイルの読み込みができないので、gulpを利用してjsファイルを順に読み込み結合します

結合するjsファイル
1. jquery ・・・js1, js2で利用するので一番最初に読み込む必要がある
2. js2.js ・・・js1から呼び出されるため、js2を先に読み込む必要がある
3. js1.js ・・・js2を呼び出すため最後に読み込む(名前順(js1⇒js2)に読み込まれるとエラーになる)

* js2.js

```js:js2.js
console.log('load js2.js');

function js2() {
	console.log('called js2');
}

$(function() {
	console.log('jquery.ready() in js2.js');
	js1();
});

```

* js1.js

```js:js1.js
console.log('load js1.js');

function js1() {
	console.log('called js1');
}

$(function() {
	console.log('jquery.ready() in js1.js');
});

console.log('js1.js call js2');
js2();

```

## &lt;script&gt;タグでファイル順を考慮して読み込んでテスト

* テスト用html

jsファイル間の依存順を考慮して読み込んでいます(jqery⇒js2⇒js1)

```html:index.html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title>js test</title>
    <script src="js/jquery-3.7.1.min.js"></script>
    <script src="js/js2.js"></script>
    <script src="js/js1.js"></script>
  </head>
  <body>
  </body>
</html>
```

ログ(j2を先に読み込んでいるため、呼び出しエラーにならない)

![alt text](./img/image.png)

※もしjs1⇒js2の順でで読み込むと未定義エラーが発生する

![alt text](./img/image-1.png)


## gulpでファイル間の依存関係(読み込み順)を考慮して結合する

* gulp.src()で`glob`を利用せず、配列で結合するファイルを順に指定して結合します

```js:all.min.js
// gulpfile.js
import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

gulp.task('default', function() {
  return gulp.src(['js/jquery-3.7.1.min.js','js/js2.js','js/js1.js'])
    .pipe(concat('all.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./js'));
});

```

* 結合したファイルを開くと、指定順に結合されています

```js:all.min.js

/*! jQuery v3.7.1 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}

/***** 中略 *****/
console.log('load js2.js');

function js2() {
	console.log('called js2');
}

$(function() {
	console.log('jquery.ready() in js2.js');
	js1();
});


console.log('load js1.js');

function js1() {
	console.log('called js1');
}

$(function() {
	console.log('jquery.ready() in js1.js');
});

console.log('js1.js call js2');
js2();

```

### 結合後のファイルで動作確認

結合したファイルを読み込んで、コンソールに出力したログの順番が変わっていない(指定した順番で結合されている)ことを確認

```html:index2.html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title>js test</title>
    <script src="js/all.min.js"></script>
  </head>
  <body>
  </body>
</html>

```

![alt text](./img/image-2.png)
