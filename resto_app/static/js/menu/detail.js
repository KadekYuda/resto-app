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

function add_to_cart(user_id, menu_id, amount) {
    $(".modal-footer").hide();
    $(".modal-body").html("<img src='/static/img/komi.gif' class='img-center'>");
    $("#successModal").modal();
    var data = {};
    data.user_id = user_id;
    data.menu_id = menu_id;
    data.amount = document.getElementById('amount').value;
    if (data.amount > 0) {
        var json = JSON.stringify(data);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4  && xhttp.status == 200) {
                $(".modal-header").addClass('bg-success');
                $(".modal-header").removeClass('bg-danger');
                $(".modal-title").text("Success!");
                $(".modal-footer").show();
                $(".modal-body").html(
                    [{img: '/static/img/ok.png', msg: 'Successfully added to your cart!'}].map(Item).join('')
                )
            } else {
                $(".modal-header").addClass('bg-danger');
                $(".modal-header").removeClass('bg-success');
                $(".modal-title").text("Failed...");
                $(".modal-footer").show();
                $(".modal-body").html(
                    [{img: '/static/img/error.png', msg: 'Addition to cart failed. Please try again'}].map(Item).join('')
                )
            }
        }
        var url = window.location.origin + "/cart/add";
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(json);
    } else {
        $(".modal-header").addClass('bg-danger');
        $(".modal-header").removeClass('bg-success');
        $(".modal-title").text("Failed...");
        $(".modal-footer").show();
        $(".modal-body").html(
            [{img: '/static/img/error.png', msg: 'Addition to cart failed. Please try again'}].map(Item).join('')
        )
    }
}