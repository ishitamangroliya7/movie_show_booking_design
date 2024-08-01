$(document).ready(function () {
    // Sticky header on scroll
    $(window).on('scroll', function () {
        $('.page-header').toggleClass('is-sticky', $(document).scrollTop() > 0);
    });

    // Datepicker initialization
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        startDate: new Date(), // Disable past dates
        autoHide: true
    });

    // Initialize movie content and tabs when the document is ready
    initializeMovieTabs();

    // Attach click event to each movie-content
    $('.movie-content').on('click', function () {
        const movieId = $(this).attr('id').split('-')[1];
        showMovieContent(movieId);
    });

    // Search for movie when arrow icon is clicked
    $('#arrow-icon').on('click', function () {
        const movieName = $('.movie-search').val().trim().toLowerCase();
        const movieId = movies.find(movie => movie.title.toLowerCase() === movieName)?.id;

        if (movieId) {
            showMovieContent(movieId);
        } else if (movieName === '') {
            showDefaultTab();
        } else {
            alert('Movie not found.');
        }
    });

    $(document).on('click', '.seat.available', function () {
        const activeMovieId = $('.movie-content.active').attr('id').split('-')[1];
        const userCount = $(`#user-name-${activeMovieId}`).children().length;
        const selectedSeats = $(`#selected-seats-${activeMovieId}`).data('seats') || [];

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            // Remove seat from selectedSeats array
            const seatId = $(this).attr('id');
            const seatIndex = selectedSeats.indexOf(seatId);
            if (seatIndex > -1) {
                selectedSeats.splice(seatIndex, 1);
                $(`#selected-seats-${activeMovieId}`).data('seats', selectedSeats);
            }
        } else {
            if (selectedSeats.length < userCount) {
                $(this).addClass('selected');
                // Add seat to selectedSeats array
                selectedSeats.push($(this).attr('id'));
                $(`#selected-seats-${activeMovieId}`).data('seats', selectedSeats);
            } else {
                alert(`You can only select ${userCount} seats.`);
            }
        }
    });

    $(document).on('keypress', '.user-input', function (e) {
        if (e.which == 13) {
            const movieId = $(this).attr('id').split('-')[2];
            addUserName(movieId);
        }
    });
});

const movies = [
    { id: 'kalki', title: 'Kalki', showTimes: ['9:30 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'], trailer: 'https://www.youtube.com/embed/BfCIPsEGAS8' },
    { id: 'kill', title: 'Kill', showTimes: ['8:30 AM', '12:30 PM', '4:00 PM', '6:30 PM'], trailer: 'https://www.youtube.com/embed/VIDEO_ID_KILL' },
    { id: 'brahmastra', title: 'Brahmastra', showTimes: ['8:30 AM', '12:30 PM', '4:00 PM', '6:30 PM'], trailer: 'https://www.youtube.com/embed/VIDEO_ID_BRAHMASTRA' },
    { id: 'sarfira', title: 'Sarfira', showTimes: ['8:30 AM', '12:30 PM', '4:00 PM', '6:30 PM'], trailer: 'https://www.youtube.com/embed/VIDEO_ID_SARFIRA' },
    { id: 'rrr', title: 'RRR', showTimes: ['8:30 AM', '12:30 PM', '4:00 PM', '6:30 PM'], trailer: 'https://www.youtube.com/embed/VIDEO_ID_RRR' }
];

function openTrailerModal(trailerUrl) {
    const modal = $('#trailerModal');
    const trailerEmbed = $('#trailerEmbed');

    trailerEmbed.html(`
        <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `);

    modal.show();

    $('.close').on('click', function () {
        modal.hide();
        trailerEmbed.html('');
    });

    $(window).on('click', function (event) {
        if ($(event.target).is(modal)) {
            modal.hide();
            trailerEmbed.html('');
        }
    });
}

function createMovieContent(movie) {
    const showTimeButtons = movie.showTimes.map(time =>
        `<button class="btn" onclick="updateShowTime('${time}', '${movie.id}')">${time}</button>`
    ).join('');

    return `
        <div class="movie-content" id="movie-${movie.id}">
            <div class="title">
                <h3>${movie.title}</h3>
            </div>
            <div class="detail-wrapper">
                <div class="detail gap-1">
                    <div class="detail-content">
                        <h4 id="confirm-msg-${movie.id}"></h4>
                        <div class="d-flex gap-4 align-items-center">
                            <div>
                                <h2>${movie.title}</h2>
                            </div>
                            <div class="trailer">
                                <i class="fa-solid fa-play" onclick="openTrailerModal('${movie.trailer}')"></i>
                            </div>
                        </div>
                        <h4 id="confirm-seat-${movie.id}"></h4>
                        <div id="selected-seats-${movie.id}" data-seats="[]"></div>
                        <div class="show-time-buttons d-flex flex-wrap gap-2 pt-2">
                            ${showTimeButtons}
                        </div>
                        <div class="users">
                            <ul class="user-name" id="user-name-${movie.id}"></ul>
                        </div>
                        <div class="d-flex align-items-end gap-3">
                            <div class="add-user">
                                <input type="text" class="user-input" id="user-input-${movie.id}" placeholder="Enter your name">
                            </div>
                        </div>
                        <div class="submit-booking">
                            <button class="btn book-btn" onclick="submitBooking('${movie.id}')">Book</button>
                        </div>
                       <div class="print-ticket pt-4" style="display: none; text-align:end;">
                           <button class="btn print-btn" onclick="printTicket('${movie.id}')">
                           <i class="fa-solid fa-print"></i> Print Ticket
                           </button>
                        </div>


                    </div>
                    
                    <div class="seat-map">
                        <div class="row">
                            <div class="seat available" id="A1"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="A2"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="A3"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat" id="A">A</div>
                            <div class="seat available" id="A4"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="A5"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="A6"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                        </div>
                        <div class="row">
                            <div class="seat available" id="B1"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="B2"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="B3"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat" id="B">B</div>
                            <div class="seat available" id="B4"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="B5"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="B6"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                        </div>
                        <div class="row">
                            <div class="seat available" id="C1"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="C2"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat" id="C">C</div>
                            <div class="seat available" id="C3"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                            <div class="seat available" id="C4"><i class="fa-solid fa-couch" aria-hidden="true"></i></div>
                        </div>
                         <div class="pt-4 d-flex gap-3">
                        <div class=" point avail"><i class="fa-solid fa-couch" aria-hidden="true"></i><small> Available</small></div>
                        <div class=" point notavail"><i class="fa-solid fa-couch" aria-hidden="true"></i><small> Not Available</small></div> 
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function printTicket(movieId) {
    const selectedDate = $(`#movie-${movieId}`).data('selectedDate');
    const selectedSeats = $(`#selected-seats-${movieId}`).data('seats') || [];
    const userNames = $(`#user-name-${movieId}`).children().map(function () {
        return $(this).text();
    }).get();
    const selectedShowTime = $(`#movie-${movieId} .selected-show-time`).text().trim();
    const movie = movies.find(movie => movie.id === movieId);

    const ticketContent = `
        <html>
        <head>
            <title>Print Ticket</title>
            <style>
                body {
                    padding: 20px;
                    background: #f7f7f7;
                }
                .ticket {
                    max-width: 400px;
                    margin: auto;
                    display: flex;
                    justify-content: space-around;
                    padding: 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                }
                .ticket h2 {
                    margin-top: 10px;
                    font-size: 24px;
                    color: #333;
                }
                .ticket h3 {
                    margin-bottom: 20px;
                    font-size: 22px;
                    color: #555;
                }
                .ticket p {
                    font-size: 16px;
                    color: #666;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="ticket">
            <div>
                <h2>Movie Ticket</h2>
                <h3>${movie.title}</h3>
                </div>
                <div>
                <p><strong>Date:</strong> ${selectedDate}</p>
                <p><strong>Show Time:</strong> ${selectedShowTime}</p>
                <p><strong>Seat:</strong> ${selectedSeats.join(', ')}</p>
                <p><strong>Name:</strong> ${userNames.join(', ')}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write(ticketContent);
    printWindow.document.close();
    printWindow.print();
}


function createTabButton(movie) {
    return `
        <button class="tab-button" onclick="showMovieContent('${movie.id}')">
            ${movie.title}
        </button>
    `;
}

function initializeMovieTabs() {
    const tabButtonsContainer = $('#tab-buttons');
    const movieTabContainer = $('#movie-tab-container');

    // Create and inject tab buttons and movie content
    tabButtonsContainer.html(movies.map(createTabButton).join(''));
    movieTabContainer.html(movies.map(createMovieContent).join(''));

    // Show default tab
    showDefaultTab();
}

function showMovieContent(movieId) {
    // Remove active class from all movie content elements
    $('.movie-content').removeClass('active');

    // Add active class to the selected movie content
    $(`#movie-${movieId}`).addClass('active');

    // Remove active class from all tab buttons
    $('.tab-button').removeClass('active');

    // Add active class to the corresponding tab button
    $(`.tab-button:contains('${movies.find(movie => movie.id === movieId).title}')`).addClass('active');
}

function showDefaultTab() {
    // Remove active class from all movie content elements
    $('.movie-content').removeClass('active');

    // Optionally, you can add an active class to a default content
    $('#movie-kalki').addClass('active'); // Change 'movie-kalki' to the id of your default movie
}

function updateShowTime(showTime, movieId) {
    $('.show-time-buttons button').removeClass('selected-show-time');
    $(`#movie-${movieId} .show-time-buttons button:contains("${showTime}")`).addClass('selected-show-time');
}

function addUserName(movieId) {
    const userInput = $(`#user-input-${movieId}`);
    const userName = userInput.val().trim();

    if (userName) {
        const userListItem = $('<li>').text(userName);
        $(`#user-name-${movieId}`).append(userListItem);
        userInput.val('');
    }
}

function submitBooking(movieId) {
    const selectedDate = $('#datepicker').val().trim();
    const selectedSeats = $(`#selected-seats-${movieId}`).data('seats') || [];
    const userNames = $(`#user-name-${movieId}`).children().map(function () {
        return $(this).text();
    }).get();
    const selectedShowTime = $(`#movie-${movieId} .selected-show-time`).text().trim();

    if (!selectedDate) {
        alert('Please select a date.');
        return;
    }

    if (selectedShowTime === '') {
        alert('Please select a show time.');
        return;
    }

    if (userNames.length === 0) {
        alert('Please enter at least one name.');
        return;
    }

    if (selectedSeats.length !== userNames.length) {
        alert(`Please select exactly ${userNames.length} seats.`);
        return;
    }

    // Store the selected date on the movie content element
    $(`#movie-${movieId}`).data('selectedDate', selectedDate);

    // Show booking confirmation
    $(`#confirm-msg-${movieId}`).text(`Booking confirmed for ${selectedDate}!`);
    $(`#confirm-seat-${movieId}`).text(`Seats: ${selectedSeats.join(', ')}`);

    // Hide other show time buttons
    $(`#movie-${movieId} .show-time-buttons button`).hide();
    $(`#movie-${movieId} .show-time-buttons button:contains("${selectedShowTime}")`).show();

    // Hide additional elements
    $('#datepicker').val('');
    $('.movie-search').val('');
    $('.trailer').hide();
    $('.users').hide();
    $(`#movie-${movieId} .print-ticket`).show();
    $(`#movie-${movieId} .show-time-buttons, #movie-${movieId} .add-user, #movie-${movieId} .submit-booking`).hide();
}

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination1",
    },
    navigation: {
        nextEl: ".swiper-button-next1",
        prevEl: ".swiper-button-prev1",
    }
});
