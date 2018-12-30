function add_to_cart(user_id, menu_id, amount) {
    var data = {};
    data.user_id = user_id;
    data.menu_id = menu_id;
    data.amount = document.getElementById('amount').value;
    if (data.amount > 0) {
        var json = JSON.stringify(data);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4  && xhttp.status == 200) {
                alert(xhttp.responseText);
            }
        }
        var url = window.location.origin + "/cart/add";
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(json);
    }
}