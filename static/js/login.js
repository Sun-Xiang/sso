function getQueryString(name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null){
    	return  unescape(r[2]); 
    }else{
    	return null;
    }
}

let LOGIN = {
		checkInput:function() {
			if ($("#loginname").val() == "") {
				alert("用户名不能为空");
				$("#loginname").focus();
				return false;
			}
			if ($("#nloginpwd").val() == "") {
				alert("密码不能为空");
				$("#nloginpwd").focus();
				return false;
			}
			return true;
		},
		doLogin:function(redirectUrl) {
			let paraUrl=getQueryString("re");
			let url=site_url_sso+"user/login";
			if(paraUrl!=null){
				url=site_url_sso+"user/login?re="+paraUrl;
			}
			$.post(url, $("#formlogin").serialize(),function(data){
				if (data.status == 'ok') {
					alert("登录成功！");
					let date=new Date(); 
					date.setTime(date.getTime()+60*60*1000);
					document.cookie="COOKIE_TOKEN="+data.result.COOKIE_TOKEN+"; expires="+date.toGMTString()+"; path=/";
					
					if(data.result.url!=undefined){
						location.href = data.result.url;
					}else if(redirectUrl != undefined){
						location.href = redirectUrl;
					}else{
						location.href = register_url+"/page/login.html";
					}
					
				} else {
					alert("登录失败，原因是：" + data.result.msg);
					$("#loginname").select();
				}
			});
		},
		login:function(redirectUrl) {
			if (this.checkInput()) {
				this.doLogin(redirectUrl);
			}
		}
	
};

function verifyInput(redirectUrl){
	LOGIN.login(redirectUrl);
}

function register (redirectUrl){
	let paraUrl=getQueryString("re");
	let url=site_url_sso+"page/register.html";
	if(redirectUrl!=undefined){
		url=site_url_sso+"page/register.html?re="+redirectUrl;
	}else if(paraUrl!=undefined){
		url=site_url_sso+"page/register.html?re="+paraUrl;
	}
	window.location = url;
}