document.addEventListener("DOMContentLoaded", function(){
    let URL = "/user/get";
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4) {
            try {
                if(ajax.status != 200) throw new SyntaxError("Статус запроса: " + ajax.status);
                var response = ajax.responseText;
                if(JSON.parse(response).status != "ok") throw new SyntaxError(JSON.parse(response).message);
                let login = JSON.parse(response).login;
                document.getElementsByName("user_name").forEach(function(node){
                    node.textContent = login;
                });
            } catch (error) {
                console.log('Ошибка ' + error.name + "\n" + error.message + "\n" + error.stack);
            }
        }
    };
    ajax.open("POST", URL);
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send();
});

document.addEventListener("DOMContentLoaded", function(){
    let URL = "/image/valid";
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4) {
            try {
                if(ajax.status != 200) throw new SyntaxError("Статус запроса: " + ajax.status);
                var response = ajax.responseText;
                if(JSON.parse(response).status != "ok") return;
                let imgSrc = JSON.parse(response).imgSrc;
                document.getElementsByName("img_user").forEach(function(node){
                    node.setAttribute("src",imgSrc);
                });
            } catch (error) {
                console.log('Ошибка ' + error.name + "\n" + error.message + "\n" + error.stack);
                alert("Ошибка проверки фото");
            }
        }
    };
    ajax.open("POST", URL);
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send();
});

document.getElementById("exit_button").addEventListener("click",function(){
    let URL = "/user/logout";
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4) {
            location.reload();
        }
    };
    ajax.open("POST", URL);
    ajax.send();
});