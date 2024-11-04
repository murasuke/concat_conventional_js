console.log('load js1.js');

function js1() {
	console.log('called js1');
}

$(function() {
	console.log('jquery.ready() in js1.js');
});

console.log('js1.js call js2');
js2();

