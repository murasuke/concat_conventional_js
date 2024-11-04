console.log('load js2.js');

function js2() {
	console.log('called js2');
}

$(function() {
	console.log('jquery.ready() in js2.js');
	js1();
});

