let parentId = 4744;
let addressLevel1 = getAddressList(parentId);

function getAddressList(parentId){
    let thisDate
    $.ajax({
        url: site_url_sso+"/area/list?parentId="+parentId,
        type: "POST",
        dataType: "json",
        async: false,
    }).done(function(res) {
        thisDate = res;    //需要返回thisDate
    })
    return thisDate;
}


for(let i=0;i<addressLevel1.result.length;i++){
	$("#address_1").append("<option value='"+addressLevel1.result[i].name+"' data-id='"+addressLevel1.result[i].id+"'>"+addressLevel1.result[i].name+"</option>");
}

function addressChanged(obj,num){
	let address_id = $(obj).find("option:selected").attr("data-id");
	let addressLevel = getAddressList(address_id);
	let count=num+1;
	$(obj).nextAll().remove();
	if(!addressLevel.result.length){
		return;
	}
	$(obj).after("<select class='address' name='address_"+num+"' id='address_"+num+"' onchange='addressChanged(this,"+count+")'><option value=''>请选择</option></select>");
	
	let address_select = $("#address_"+num);
	for(let i=0;i<addressLevel.result.length;i++){
		$(address_select).append("<option value='"+addressLevel.result[i].name+"' data-id='"+addressLevel.result[i].id+"'>"+addressLevel.result[i].name+"</option>");
	}
}

function checkaddress(addform){
	let addressCheck = $(addform).find(".address");
	let city = "";
	for(let i=0;i<addressCheck.length;i++){
		if(addressCheck[i].value==""){
			alert("请选择地址");
			return false;
		}else{
			if(i==0){
				city += addressCheck[i].value
			}else{
				city += ","+addressCheck[i].value;
			}
		}
	}
	addform.city.value=city;
	if(addform.detail.value==""){
		alert("请输入详细地址");
		return false;
	}
	if(addform.receiverName.value==""){
		alert("请输入收件人姓名");
		return false;
	}
	
	let strphone = addform.receiverMobile.value.trim();
	let pattern = /^[0-9]{11}$/;
	if(strphone.length != 11 || !pattern.test(strphone) ){
		alert("请输入正确手机号码");
		return false;
	}
	addform.action=site_url_sso+"address/address/add";
	return true;
}

function addressEdit(id){
	alert(id);
	$.ajax({
		url: site_url_sso+"address/address/del/"+id,
		type: "POST",
        dataType: "json",
        async: true,
        success:function (data) {
			if (data.status=='ok') {
				alert("地址删除成功！");
			}	
		}
    })
}

