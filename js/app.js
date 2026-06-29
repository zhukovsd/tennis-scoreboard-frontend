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

function initMatchScorePage() {
    var matchUuid;

    $(function () {
        matchUuid = new URLSearchParams(window.location.search).get('uuid');
        if (!matchUuid) {
            $('#error-message').text('No match ID provided.').show();
            return;
        }

        loadMatch();

        $(document).on('click', '.point-btn', function () {
            var playerName = $(this).data('player-name');
            $.ajax({
                method: 'POST',
                url: HOST + 'matches/' + matchUuid + '/point',
                contentType: 'application/json',
                data: JSON.stringify({name: playerName}),
                success: function (match) {
                    renderMatch(match);
                },
                error: function (xhr) {
                    var message = xhr.responseJSON
                        ? xhr.responseJSON.message
                        : 'An error occurred.';
                    $('#error-message').text(message).show();
                }
            });
        });
    });

    function loadMatch() {
        $.get(HOST + 'matches/' + matchUuid, function (match) {
            renderMatch(match);
        }).fail(function (xhr) {
            var message = xhr.responseJSON
                ? xhr.responseJSON.message
                : 'Failed to load match.';
            $('#error-message').text(message).show();
        });
    }

    function renderMatch(match) {
        renderPlayer('#player1', match.firstPlayer);
        renderPlayer('#player2', match.secondPlayer);

        $('.point-btn').first().data('player-name', match.firstPlayer.name);
        $('.point-btn').last().data('player-name', match.secondPlayer.name);

        if (match.winnerName) {
            $('.point-btn').hide();
            $('#winner-message').show();
            $('#winner-text').text('Winner: ' + match.winnerName);
        } else {
            $('.point-btn').show();
            $('#winner-message').hide();
        }

        $('#error-message').hide();
    }

    function renderPlayer(prefix, player) {
        $(prefix + '-name').text(player.name);
        $(prefix + '-sets').text(player.sets);
        $(prefix + '-games').text(player.games);
        if (player.tieBreakPoints !== null) {
            $(prefix + '-points').text(player.tieBreakPoints);
        } else {
            $(prefix + '-points').text(player.points);
        }
    }
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
    if ($('#score-body').length) {
        initMatchScorePage();
    }
});
