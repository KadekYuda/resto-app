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
            $(".modal-header").addClass('bg-danger');
            $(".modal-header").removeClass('bg-success');
            $(".modal-title").text("Failed...");
            $(".modal-footer").html(
                `
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>   
                `
            )
            $(".modal-body").html(
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
    $(".modal-body").html("<p>This action cannot be undone! Are you sure?</p>");
    $("#confirmModal").modal();
    $(".modal-footer").html(
        [{user_id: user_id, menu_id: menu_id}].map(Confirmation).join('')
    )
}