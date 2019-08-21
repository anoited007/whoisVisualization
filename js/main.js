
// $("#submit").on('click', sendData);
$(function () {
    document.querySelector("#submit").addEventListener('click', sendData);
});

function sendData() {
    const baseUrl = 'https://rdap.afrinic.net/rdap/';
    let query = $("#query");

    if (query.val().trim() !== "" && $("#ip").prop("checked")) {
        $.ajax(baseUrl + "ip/" + query.val(), function (data) {
            $.post("/json", data);
        })
    }
}