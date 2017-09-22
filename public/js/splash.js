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