var particle = new Particle();
var token

particle.login({username: $('#username').val(), password: $('#password').val()}).then( function(result) {

	console.log(result)
	token = result.body.access_token;

}).catch( function(err) {

	window.alert('Something went wrong')

})

$('#send').on('click tap', function() {
	var arguments = 'c';
	var values = [];
	var i = 0;

	$('.color').each(function(obj) {

		if (i % 2 == 0) {

			values[i] = Math.floor(parseInt($(obj).val()) / 128);

		} else {

			values[i] = parseInt($(obj).val()) - Math.floor(parseInt($(obj).val()) / 128);
		}

	})

	console.log(values);

	// Set all channels to 'on'
	arguments += String.fromCharCode(127);

	arguments += String.fromCharCode(Math.floor($('#c0r').val() / 128));
	arguments += String.fromCharCode(Math.floor($('#c0r').val()) - Math.floor($('#c0r').val() / 128));

	arguments += String.fromCharCode(Math.floor($('#c0g').val() / 128));
	arguments += String.fromCharCode(Math.floor($('#c0g').val()) - Math.floor($('#c0r').val() / 128));

	arguments += String.fromCharCode(Math.floor($('#c0b').val() / 128));
	arguments += String.fromCharCode(Math.floor($('#c0b').val()) - Math.floor($('#c0r').val() / 128));

	arguments += String.fromCharCode(Math.floor($('#c1r').val() / 128));
	arguments += String.fromCharCode(Math.floor($('#c0r').val()) - Math.floor($('#c0r').val() / 128));

	arguments += String.fromCharCode(Math.floor($('#c1g').val() / 128));
	arguments += String.fromCharCode(Math.floor($('#c0g').val()) - Math.floor($('#c0r').val() / 128));

	arguments += String.fromCharCode(Math.floor($('#c1b').val() / 128));
	arguments += String.fromCharCode(Math.floor($('#c0b').val()) - Math.floor($('#c0r').val() / 128));

	arguments += String.fromCharCode(1);
	arguments += String.fromCharCode(1);
	arguments += String.fromCharCode($('#interpolationtime').val());

	console.log(arguments);
	console.log(arguments.length);

	var fnPr = particle.callFunction({ deviceId: $('#deviceid').val(), name: 'lights', argument: arguments, auth: token });

	fnPr.then(
		function(data) {
			console.log('Function called succesfully:', data);
		}, function(err) {
			console.log('An error occurred:', err);
	});

})