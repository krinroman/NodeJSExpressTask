let loginInput = document.getElementById("login");
let passwordInput = document.getElementById("password");
function isValid() {
    if (loginInput.value.length > 0 && passwordInput.value.length > 0) {
        return true;
    }
    return false;
}

document.getElementById("enter").addEventListener('click', function () {
    console.log("push enter");
    if (isValid()) {
        let data = { login: loginInput.value, password: passwordInput.value };
        let URL = "/user/valid";
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                try {
                    if (ajax.status != 200) throw new SyntaxError("Статус запроса: " + ajax.status);
                    var response = ajax.responseText;
                    if (JSON.parse(response).status != "ok") throw new SyntaxError(JSON.parse(response).message);
                    location.reload();
                } catch (error) {
                    console.log('Ошибка ' + error.name + "\n" + error.message + "\n" + error.stack);
                    alert("Не удалось авторизоваться на сайте\n" + error.message);
                }
            }
        };
        ajax.open("POST", URL);
        ajax.setRequestHeader("Content-type", "application/json");
        ajax.send(JSON.stringify(data));
    }
});

document.getElementById("reg").addEventListener('click', function () {
    console.log("push reg");
    if (isValid()) {
        let data = { login: loginInput.value, password: passwordInput.value };
        let URL = "/user/add";
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                try {
                    if (ajax.status != 200) throw new SyntaxError("Статус запроса: " + ajax.status);
                    var response = ajax.responseText;
                    if (JSON.parse(response).status != "ok") throw new SyntaxError(JSON.parse(response).message);
                    location.reload();
                } catch (error) {
                    console.log('Ошибка ' + error.name + "\n" + error.message + "\n" + error.stack);
                    alert("Не удалось добавить пользователя\n" + error.message);
                }
            }
        };
        ajax.open("POST", URL);
        ajax.setRequestHeader("Content-type", "application/json");
        ajax.send(JSON.stringify(data));
    }
});