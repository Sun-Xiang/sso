/**
 * 通用方法，用于在注册后面显示红色警告信息
 */
function showErrorMsg(eId,msg){
	document.getElementById(eId).innerHTML = msg;
	document.getElementById(eId).style.display = "block";
}

function clearMsg(eId){
	document.getElementById(eId).style.display = "none";    
}

/**
 * 取token。 header添加登入，退出button
 */
$(function(){
	
	let check_user=$.cookie("COOKIE_TOKEN");
	if(!check_user){
		$("#login_bar").html('<a class="link-btn orange" href="" id="addproduct"><span>出售商品</span></a>'+
							'<a class="link-btn orange" href="" id="login"><span>登录</span></a>'+
							'<a class="link-btn light_green" href="" id="adduser"><span>免费注册</span></a>');
		return;
	}
	
	$.ajax({
		url:site_url_sso+"user/token/"+check_user,
		dataType:'json',
		type:'get',
		success:function (data) {
			if (data.status=='ok') {
				let date=new Date(); 
				date.setTime(date.getTime()+60*60*1000);
				document.cookie="COOKIE_TOKEN="+check_user+"; expires="+date.toGMTString()+"; path=/";
				let user_name=data.result.nickName;
				$("#userInfoId").val(data.result.id);
				$("#login_bar").html("<a class='link-btn orange' href='' id='addproduct'><span>出售商品</span></a>"+user_name+",欢迎来到富聿通 <a href='javascript:logout();' style='color:red;'>退出</a>");
			}else{
				return;
			}	
		}
	});
});

/**
 * 注册
 */
function verifyphone(mobile,eId){
	let msg = "";
	let strphone = mobile.trim();
	if(strphone.length != 11 ){
		msg = "<font color='red'>手机号11位</font>";
		showErrorMsg(eId,msg);
		return false;
	}
	//使用正则表达式验证
	let pattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
	if(pattern.test(strphone)){
		clearMsg(eId);
		$.ajax({
			url :site_url_sso+"user/check/"+strphone+"/2?r=" + Math.random(),type:'get',
			success : function(data) {
				if (data.status=='ok') {
					$("#check_phone").val(1);
					return true;
				}else{
					msg = "<font color='red'>此手机号已经被注册！</font>";
					showErrorMsg(eId,msg);
					$("#check_phone").val(0);
					return false;
				}
			}
		});
	}else{
		msg = "<font color='red'>手机号输入错误</font>";   
		showErrorMsg(eId,msg);
		return false;
	}
}

function verifyPass(pwd,eId){
	let msg = "";
	let strPwd = pwd.trim();
	//密码必须6~20位.
	if(strPwd.length < 6 || strPwd.length > 20 ){
		msg = "<font color='red'>密码必须6~20位</font>";
		showErrorMsg(eId,msg);
		return false;
	}
	//使用正则表达式验证
	let pattern = /^[a-zA-Z0-9]{0,19}$/;
	if(pattern.test(strPwd)){
		clearMsg(eId);
		return true;
	}else{
		msg = "<font color='red'>密码格式错误</font>";   
		showErrorMsg(eId,msg);
		return false;
	}   
}

function verifyRePass(pwd,pwd1,eId){
	let msg = "";
	let strPwd1 = pwd.trim();
	let strPwd2 = pwd1.trim();
	//密码必须6~20位.
	if(strPwd1 != strPwd2){
		msg = "<font color='red'>两次密码输入不一致</font>";
		showErrorMsg(eId,msg);
		return false;
	}else{
		clearMsg(eId);
		return true;    
	}   
}

function getQueryString(name) {
	let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null){
    	return  unescape(r[2]); 
    }else{
    	return null;
    }
}

function verifyInput(){
	let paraUrl =getQueryString('re');
	//通过表单名称，得到输入表单
	let form = $("#form1");

	if(check_phone.value==""){
		msg = "<font color='red'>请填写手机号</font>";
		showErrorMsg("div_phone",msg);
	}
	
	//以此验证
	if(check_phone.value>0&&verifyPass(password.value,'div_pwd1')&&verifyRePass(password.value,txt_Pwd2.value,'div_pwd2')&&validate()){
		let url="user/register";
		if(paraUrl!=null&&paraUrl!=undefined){
			url="user/register?re="+paraUrl;
		}
		$.post(site_url_sso+url,form.serialize(), function(data){
			if(data.status == 'ok'){
				alert('用户注册成功！');
				let date=new Date(); 
				date.setTime(date.getTime()+60*60*1000);
				document.cookie="COOKIE_TOKEN="+data.result.COOKIE_TOKEN+"; expires="+date.toGMTString()+"; path=/";
				if(data.result.url!=undefined){
					location.href = data.result.url;
				}else{
					location.href = site_url_sso+"page/login.html";
				}
				
			} else {
				alert("注册失败！");
				return false;
			}
		});
	}else{
		alert("注册失败，请安红色提示修改"); 
		return false;
	}   
}

/**
 * 修改密码
 */
function changeInput(){
	//通过表单名称，得到输入表单
	let form = $("#form1");
	//以此验证
	alert(id.value);
	if(verifyPass(password.value,'div_pwd1')&&verifyRePass(password.value,txt_Pwd2.value,'div_pwd2')&&validate()){
		$.post(site_url_sso+"user/changePassword",form.serialize(), function(data){
			if(data.status == 'ok'){
				alert('修改密码成功！');
					location.href = site_url_item+"message/usermessageinfo?userId="+id.value;
			} else {
				alert("修改密码失败！");
				return false;
			}
		});
	}else{
		alert("修改密码失败，请安红色提示修改"); 
		return false;
	}   
}

/**
 * 用户昵称验证
 */
function verifyNickName(nickName,eId){
	let msg = "";
	nickName = nickName.trim();
	if(nickName.length < 6 || nickName.length > 20 ){
		msg = "<font color='red'>昵称必须6~20位</font>";
		showErrorMsg(eId,msg);
		return false;
	}
	let pattern = /^[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$/
	if(pattern.test(nickName)){
		clearMsg(eId);
		$.ajax({
			url:site_url_sso+"user/check/"+escape(nickName)+"/1?r=" + Math.random(),
			type:'get',
			success:function (data) {
				if (data.status=='ok') {
					$("#check_name").val(1);
					return true;
				}else{
					msg = "<font color='red'>此昵称已经被占用，请选择其他昵称</font>";
					showErrorMsg(eId,msg);
					$("#check_name").val(0);
					return false;
				}
			},  
			error:function (err) {  
				alert('出现错误了!!!');  
			}
		});
	}else{
		msg = "<font color='red'>昵称输入错误</font>";   
		showErrorMsg(eId,msg);
		return false;
	}
}
/**
 * 完善用户详情信息
 */
function verifyIdCode(idCode,eId){
	let msg = "";
	let strCode = idCode.trim();
	//密码必须6~20位.
	if(strCode.length != 18 ){
		msg = "<font color='red'>请输入正确二代身份证</font>";
		showErrorMsg(eId,msg);
		return false;
	}
	//使用正则表达式验证
	let pattern = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	if(pattern.test(strCode)){
		clearMsg(eId);
		return true;
	}else{
		msg = "<font color='red'>二代身份证格式错误</font>";   
		showErrorMsg(eId,msg);
		return false;
	}   
}

function getQueryString(name) {
	let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if(r!=null){
  	return  unescape(r[2]); 
  }else{
  	return null;
  }
}

function improve(){
	let paraUrl = getQueryString('re');
	let form = $("#complete");

	let url = "user/userdetail/add";
	if(paraUrl != null && paraUrl != undefined){
		url = "user/userdetail/add?re=" + paraUrl;
	}
	$.post(site_url_sso + url, form.serialize(), function(data){
		if(data.status == 'ok'){
			alert('用户信息添加成功！');
			if(data.result.url != undefined){
				location.href = data.result.url;
			}else{
				location.href = site_url_sso+"page/login.html";
			}	
		} else {
			alert("用户信息添加失败！");
			return false;
		}
	});
}

/**
 * 退出
 */
function logout(){
	let check_user = $.cookie("COOKIE_TOKEN");
	$.ajax({
		url: site_url_sso + "user/out/" + check_user,
		dataType: 'json',
		type: 'get',
		success: function (data) {	
		}
	});
	let date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = "COOKIE_TOKEN=''; path=/; expires=" + date.toGMTString();
	location.reload();
}

/**
 * 验证码
 */
//设置一个全局的变量，便于保存验证码
let code;
function createCode(){
    //首先默认code为空字符串
    code = '';
    //设置长度，这里看需求，我这里设置了4
    let codeLength = 4;
    let codeV = document.getElementById('code');
    //设置随机字符
    let random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z');
    //循环codeLength 我设置的4就是循环4次
    for(let i = 0; i < codeLength; i++){
        //设置随机数范围,这设置为0 ~ 36
         let index = Math.floor(Math.random()*36);
         //字符串拼接 将每次随机的字符 进行拼接
         code += random[index]; 
    }
    //将拼接好的字符串赋值给展示的Value
    codeV.value = code;
}

//下面就是判断是否== 的代码，无需解释
function validate(){
	let msg = "";
    let oValue = document.getElementById('input').value.toUpperCase();
    let eId='div_input';
    if(oValue ==0){
        msg = "<font color='red'>请输入验证码</font>";
		showErrorMsg(eId,msg);
        return false;
    }else if(oValue != code){
        msg = "<font color='red'>验证码不正确，请重新输入</font>";
		showErrorMsg(eId,msg);
        oValue = ' ';
        createCode();
        return false;
    }else{
    	 return true;
    }
}

//设置此处的原因是每次进入界面展示一个随机的验证码，不设置则为空
window.onload = function (){
    createCode();
}