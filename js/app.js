const HOST = '';

function initNewMatchPage() {
    $('#new-match-form').on('submit', function (e) {
        e.preventDefault();

        var playerOne = $('#playerOne').val().trim();
        var playerTwo = $('#playerTwo').val().trim();
        var format = $('#matchFormat').val();

        var requestData = {
            firstPlayerName: playerOne,
            secondPlayerName: playerTwo,
            matchFormat: format
        };

        $.ajax({
            method: 'POST',
            url: HOST + 'matches',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (data) {
                window.location.href = 'match-score.html?uuid=' + data.id;
            },
            error: function (xhr) {
                var message = xhr.responseJSON
                    ? xhr.responseJSON.message
                    : 'An error occurred. Please try again.';
                $('#error-message').text(message).show();
            }
        });
    });
}

$(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    if ($('#new-match-form').length) {
        initNewMatchPage();
    }
});
