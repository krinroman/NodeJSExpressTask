let loginInput = document.getElementById("login");
let passwordInput = document.getElementById("password");
function isValid(){
	if(loginInput.value.length > 0 && passwordInput.value.length > 0){
		return true;
	}
	return false;
}

document.getElementById("enter").addEventListener('click', function(){
	console.log("push enter");
	if(isValid()){
		let data = {login: loginInput.value, password: passwordInput.value};
		let URL = "/user/valid";
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4) {
				if(ajax.status == 200){
					var response = ajax.responseText;
					console.log(response);
					if(JSON.parse(response).status == "ok"){
						document.cookie = "userId="+ JSON.parse(response).id;
						location.reload();
					}
					else alert("Не удалось авторизоваться на сайте\nПопробуйте зарегистрироваться");
				}
				else alert("Не удалось авторизоваться на сайте\nПопробуйте зарегистрироваться");
			}
		};
		ajax.open("POST", URL);
		ajax.setRequestHeader("Content-type", "application/json");
		ajax.send(JSON.stringify(data));
	}
});

document.getElementById("reg").addEventListener('click', function(){
	console.log("push reg");
	if(isValid()){
		let data = {login: loginInput.value, password: passwordInput.value};
		let URL = "/user/add";
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4) {
				if(ajax.status == 200){
					var response = ajax.responseText;
					console.log(response);
					if(JSON.parse(response).status == "ok"){
						document.cookie = "userId="+ JSON.parse(response).id;
						location.reload();
					}
					else alert("Не удалось добавить пользователя");
				}
				else alert("Не удалось добавить пользователя");
			}
		};
		ajax.open("POST", URL);
		ajax.setRequestHeader("Content-type", "application/json");
		ajax.send(JSON.stringify(data));
	}
});