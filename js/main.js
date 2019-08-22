
// $("#submit").on('click', sendData);
$(function () {
    document.querySelector("#submit").addEventListener('click', sendData);
});

function sendData() {
    console.log("Button Event Fired");
    const baseUrl = 'https://rdap.afrinic.net/rdap/';
    let query = $("#query");
    let queryValue = query.val().trim();

    if (queryValue !== "" && $("#ip").prop("checked")) {
        $.getJSON(baseUrl + "ip/" + queryValue, function (data) {
            console.log(data);
            $.post("/json", data);
        })
    }

    else if(queryValue !== "" && $("#as-number").prop("checked")){
        $.getJSON(baseUrl + "autnum/" + queryValue, function (data) {
            console.log(data)
            $.post("/json", data);
        })
    }

    else if(queryValue !== "" && $("#rdns").prop("checked")){
        $.getJSON(baseUrl + "domain/" + queryValue, function (data) {
            $.post("/json", data);
        })
    }

    else if(queryValue !== "" && $("#entity").prop("checked")){
        $.getJSON(baseUrl + "entity/" + queryValue, function (data) {
            $.post("/json", data);
        })
    }
}