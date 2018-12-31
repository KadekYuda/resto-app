const Item = ({ img, msg }) => `
    <div class="row">
        <div class="col-sm-3">
            <img src="${img}" class="img-thumbnail">
        </div>
        <div class="col-sm-9">
            <p>${msg}</p>
        </div>
    </div>
`;

const Confirmation = ({ user_id, menu_id }) => `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
    <button type="button" class="btn btn-danger" onclick="delete_from_cart(${user_id}, ${menu_id})">Yes</button>
`

function delete_from_cart(user_id, menu_id) {
    var data = {};
    data.user_id = user_id;
    data.menu_id = menu_id;
    var json = JSON.stringify(data);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4  && xhttp.status == 200 && xhttp.responseText === "true") {
            location.reload();
        } else if (xhttp.readyState == 4  && xhttp.status == 200 && !xhttp.responseText) {
            $("#confirmModal").find(".modal-header").addClass('bg-danger');
            $("#confirmModal").find(".modal-title").text("Failed...");
            $("#confirmModal").find(".modal-footer").html(
                `
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>   
                `
            )
            $("#confirmModal").find(".modal-body").html(
                [{img: '/static/img/error.png', msg: 'Deletion from cart failed. Please try again'}].map(Item).join('')
            )
        }
    }
    var url = window.location.origin + "/cart/delete";
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
}

function activate_del_modal(user_id, menu_id) {
    $("#confirmModal").modal();
    $("#confirmModal").find(".modal-footer").html(
        [{user_id: user_id, menu_id: menu_id}].map(Confirmation).join('')
    )
}

function add_order(user_id) {
    $("#orderModal").find(".modal-footer").hide();
    $("#orderModal").find(".modal-body").html("<img src='/static/img/komi.gif' class='img-center'>");
    var xhttp = new XMLHttpRequest();
    var data = {};
    data.user_id = user_id;
    var json = JSON.stringify(data);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4  && xhttp.status == 200 && xhttp.responseText === "true") {
            $("#orderModal").find(".modal-title").text("Success!");
            $("#orderModal").find(".modal-body").html(
                [{img: '/static/img/ok.png', msg: 'Order successfully placed!'}].map(Item).join('')
            )
        } else if (xhttp.readyState == 4  && xhttp.status == 200 && !xhttp.responseText) {
            $("#orderModal").find(".modal-title").text("Failed...");
            $("#orderModal").find(".modal-body").html(
                [{img: '/static/img/error.png', msg: 'Order placement failed. Please try again'}].map(Item).join('')
            )
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            $("#orderModal").find(".modal-title").text("Failed...");
            $("#orderModal").find(".modal-body").html(
                [{img: '/static/img/error.png', msg: 'Order placement failed. Please try again'}].map(Item).join('')
            )
        }
        $("#orderModal").find(".modal-footer").html(
            '<button type="button" class="btn btn-Primary" data-dismiss="modal" onclick=location.reload()>Ok</button>'
        )
        $("#orderModal").find(".modal-footer").show();
    }
    var url = window.location.origin + "/order/";
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
}