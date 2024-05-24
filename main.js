function record() {
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';

    var videoPlayer = document.getElementById('videoPlayer');
    var picturePath = 'Asset/hear.jpeg';

    var img = document.createElement('img');
    img.setAttribute('src', picturePath);
    img.setAttribute('width', '640');
    img.setAttribute('height', '360');

    videoPlayer.innerHTML = '';
    videoPlayer.appendChild(img);

    recognition.onresult = function (event) {
        console.log(event)
        document.getElementById('videoNames').value = event.results[0][0].transcript;
    }

    recognition.onend = function() {
        var stillPicturePath = 'Asset/still.jpeg';
        var stillImg = document.createElement('img');
        stillImg.setAttribute('src', stillPicturePath);
        stillImg.setAttribute('width', '640');
        stillImg.setAttribute('height', '360');

        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(stillImg);
    };

    recognition.start();
}

function displayPicture() {
    var videoPlayer = document.getElementById('videoPlayer');
    var picturePath = 'Asset/still.jpeg';

    var img = document.createElement('img');
    img.setAttribute('src', picturePath);
    img.setAttribute('width', '640');
    img.setAttribute('height', '360');

    videoPlayer.innerHTML = '';
    videoPlayer.appendChild(img);
}

function playVideos() {
    var videoNames = document.getElementById('videoNames').value.split(' ');
    var videoPlayer = document.getElementById('videoPlayer');
    var videoTitle = document.getElementById('videoTitle');

    videoTitle.innerHTML = videoNames.map(name => `<span>${name}</span>`).join(' ');

    playNextVideo(videoNames, 0, videoPlayer, function() {
        displayPicture();
        videoTitle.textContent = '';
    });
}

function playNextVideo(videoNames, index, videoPlayer, callback) {
    if (index >= videoNames.length) {
        // If all videos are played, execute the callback function
        if (callback && typeof(callback) === "function") {
            callback();
        }
        return;
    }

    var videoName = videoNames[index].toLowerCase();
    var videoPath = 'SignAsset/' + videoName + '.mp4';

    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', videoPath, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var video = document.createElement('video');
            video.setAttribute('width', '640');
            video.setAttribute('height', '360');

            var source = document.createElement('source');
            source.setAttribute('src', videoPath);
            source.setAttribute('type', 'video/mp4');

            video.appendChild(source);

            videoPlayer.innerHTML = '';
            videoPlayer.appendChild(video);

            var videoTitle = document.getElementById('videoTitle');
            var words = videoTitle.querySelectorAll('span');
            words.forEach((word, idx) => {
                word.style.color = idx === index ? 'red' : 'black';
            });

            video.onended = function () {
                words[index].style.color = 'black';
                playNextVideo(videoNames, index + 1, videoPlayer, callback);
            };

            video.play().catch(function (error) {
                console.error('Error playing video:', error);
                words[index].style.color = 'black';
                playNextVideo(videoNames, index + 1, videoPlayer, callback);
            });
        } else {
            var letters = videoName.split('');
            playNextLetter(letters, 0, videoPlayer, videoNames, index, callback);
        }
    };
    xhr.send();
}

function playNextLetter(letters, index, videoPlayer, videoNames, wordIndex, callback) {
    if (index >= letters.length) {
        var videoTitle = document.getElementById('videoTitle');
        var words = videoTitle.querySelectorAll('span');
        words[wordIndex].style.color = 'black';
        playNextVideo(videoNames, wordIndex + 1, videoPlayer, callback);
        return;
    }

    var letter = letters[index].toLowerCase();
    var videoPath = 'SignAsset/' + letter + '.mp4';

    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', videoPath, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var video = document.createElement('video');
            video.setAttribute('width', '640');
            video.setAttribute('height', '360');

            var source = document.createElement('source');
            source.setAttribute('src', videoPath);
            source.setAttribute('type', 'video/mp4');

            video.appendChild(source);

            videoPlayer.innerHTML = '';
            videoPlayer.appendChild(video);

            var videoTitle = document.getElementById('videoTitle');
            var words = videoTitle.querySelectorAll('span');
            var currentWord = words[wordIndex];
            var highlightedText = letters.map((ltr, idx) => `<span style="color: ${idx === index ? 'red' : 'black'}">${ltr}</span>`).join('');
            currentWord.innerHTML = highlightedText;

            video.onended = function () {
                playNextLetter(letters, index + 1, videoPlayer, videoNames, wordIndex, callback);
            };

            video.play().catch(function (error) {
                console.error('Error playing video:', error);
                playNextLetter(letters, index + 1, videoPlayer, videoNames, wordIndex, callback);
            });
        } else {
            playNextLetter(letters, index + 1, videoPlayer, videoNames, wordIndex, callback);
        }
    };
    xhr.send();
}
