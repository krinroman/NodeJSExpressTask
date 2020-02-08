let setCookie = function(name, value, options = {}){

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

 
function getCookie ( cookie_name )
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
 
  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

let deleteCookie =  function(name){
  setCookie(name, "", {
    'max-age': -1
  })
}

document.addEventListener("DOMContentLoaded", function(){
	let data = {id: getCookie("userId")};
	let URL = "/user/get";
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4) {
			if(ajax.status == 200){
				var response = ajax.responseText;
				if(JSON.parse(response).status == "ok"){
					let login = JSON.parse(response).login;
					document.getElementById("user_name").textContent = login;
				}
				else alert("Не получить логин");
			}
			else alert("Не получить логин");
		}
	};
	ajax.open("POST", URL);
	ajax.setRequestHeader("Content-type", "application/json");
	ajax.send(JSON.stringify(data));
});

let inputElement = document.getElementById("input_text");
let outputElement = document.getElementById("list_out");

function getIndexCheckedRadioButton(){
	let rad=document.getElementsByName('sort');
	for (let i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            return i;
        }
    }
}

document.getElementById("add_button").addEventListener("click", function(){
	if(inputElement.value.length > 0){
		let text = inputElement.value;
		let data = {value: text};
		let URL = "/";
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4) {
				if(ajax.status == 200){
					var response = ajax.responseText;
					if(JSON.parse(response).status == "ok"){
						location.reload();
					}
					else alert("Не удалось добавить запись");
				}
				else alert("Не удалось добавить запись");
			}
		};
		ajax.open("POST", URL);
		ajax.setRequestHeader("Content-type", "application/json");
		ajax.send(JSON.stringify(data));
	}	
});

document.getElementById("exit_button").addEventListener("click",function(){
	deleteCookie("userId");
	location.reload();
});

outputElement.addEventListener('click', function(event){
 	if(event.target.id == "del_button"){
 		let id = event.target.getAttribute("data-id")
		let URL = "/delete/"+id;
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4) {
				if(ajax.status == 200){
					var response = ajax.responseText;
					if(JSON.parse(response).status == "ok"){
						document.getElementById("item_"+id).remove();
					}
					else alert("Не удалось удалить запись");
				}
				else alert("Не удалось удалить запись");
			}
		};
		ajax.open("POST", URL);
		ajax.setRequestHeader("Content-type", "application/json");
		ajax.send();
 		
 	}

 	if(event.target.id == "edit_button"){
 		let id = event.target.getAttribute("data-id")
 		let editElement = document.getElementById("item_"+id);
 		editElement.style.display = 'none';
 		let text = editElement.querySelector("span[id=value]").textContent;
 		let newElementEdit = document.createElement("li");
 		newElementEdit.setAttribute("id", "item_edit_"+id);
 		newElementEdit.innerHTML = "<input type=\"text\" name=\"edit_text\" id=\"edit_input\" data-id=\""+id+"\" value=\""+text+"\">" +
							" <button id=\"ok_button\" data-id=\""+id+"\" class=\"button-simple\">ок</button>" +
							" <button id=\"cancel_button\" data-id=\""+id+"\" class=\"button-simple\">отмена</button>";
		editElement.after(newElementEdit);
 	}

 	if(event.target.id == "ok_button" || event.target.id == "cancel_button"){
		let id = event.target.getAttribute("data-id");
		let editElement = document.getElementById("item_edit_"+id);
		let text = editElement.querySelector("input").value;
		let editOutputElement = document.getElementById("item_"+id);
		if(event.target.id == "ok_button"){
			let data = {value: text};
			let URL = "/"+id;
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function() {
				if (ajax.readyState == 4) {
					if(ajax.status == 200){
						var response = ajax.responseText;
						if(JSON.parse(response).status == "ok"){
							location.reload();
						}
						else alert("Не удалось изменить запись");
					}
					else alert("Не удалось изменить запись");
				}
			};
			ajax.open("POST", URL);
			ajax.setRequestHeader("Content-type", "application/json");
			ajax.send(JSON.stringify(data));		
		}
		editOutputElement.style.display = 'list-item';
		editElement.remove();
 	}

});

document.getElementById("radio_box").addEventListener("click", function(){
	location.replace("http://localhost:3000/?sort="+getIndexCheckedRadioButton());
});




