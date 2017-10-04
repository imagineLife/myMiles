$(function(){
  if(Cookies.get('authToken')){
    $('.login')
      .text('View Trips')
      .attr('href', '/trips');
  }else{
    $('.login')
      .text('Login')
      .attr('href', '/trips');
  }
})

function redirect(user){
	Cookies.set('authToken', user.authToken);
	console.log(Cookies.get('authToken'));
	window.location='/trips'
}

function logInDemo(){
	let loginURL = '/api/auth/login';
	let demoCredentials = {username: "demoUser", password: "DemoUserPassword"};
	const { username, password } = demoCredentials;
	const encodedStr = btoa(`${username}:${password}`);

	const infoSettings = {
	    url: loginURL,
	    type: 'POST',
		beforeSend: req => {
		    req.setRequestHeader('Authorization', 'Basic ' + encodedStr);
		  },
  	    contentType: 'application/json',
	    data: JSON.stringify(demoCredentials),
	};

	$.ajax(infoSettings)
		.then(redirect)
		.catch((err)=>console.log(err));
}

$('#demoButton')
	.on('click', (ev)=>{
		ev.preventDefault();
		logInDemo();
	})