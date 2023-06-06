document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('xd2');
    const createButton = document.getElementById('button2');
    const mediaInput = document.getElementById('mediaInput2');
    const fileLabel = document.getElementById('fileLabel2');
    const messageContainer = document.getElementById('messageContainer');

    let messages = [];

    // Load stored messages from localStorage on page load
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
        displayMessages();
    }

    createButton.addEventListener('click', function () {
        const message = textarea.value;
        const mediaFiles = mediaInput.files;

        if (message || mediaFiles.length > 0) {
            const startTime = new Date();

            // Create a message object with the input message, timestamp, and media files
            const newMessage = {
                message: message,
                timestamp: startTime.getTime(),
                likes: 0,
                liked: false,
                mediaFiles: []
            };

            // Convert media files to Base64 and store them in the message object
            if (mediaFiles.length > 0) {
                // Remove the file preview container once the div is created
                    mediaPreviewContainer.innerHTML = ' ';
                const mediaCount = mediaFiles.length;
                let mediaProcessed = 0;

                for (let i = 0; i < mediaFiles.length; i++) {
                    const file = mediaFiles[i];
                    const reader = new FileReader();

                    reader.onload = function (event) {
                        const base64Data = event.target.result;
                        newMessage.mediaFiles.push(base64Data);

                        // Check if all media files have been processed
                        if (++mediaProcessed === mediaCount) {
                            saveMessage(newMessage, mediaPreviewContainer);
                        }
                    };

                    reader.readAsDataURL(file);
                }
            } else {
                saveMessage(newMessage, mediaPreviewContainer);
            }
        }
    });

    textarea.addEventListener('input', function () {
        createButton.disabled = textarea.value.trim() === '' && mediaInput.files.length === 0;
    });

    mediaInput.addEventListener('change', function () {
        createButton.disabled = textarea.value.trim() === '' && mediaInput.files.length === 0;

        displaySelectedFiles(mediaInput.files);
    });
    function displaySelectedFiles(files) {
        const mediaPreviewContainer = document.getElementById('mediaPreviewContainer2');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                const filePreview = document.createElement('img');
                filePreview.src = event.target.result;
                filePreview.className = 'file-preview';
                mediaPreviewContainer.appendChild(filePreview);
            };

            fileReader.readAsDataURL(file);
        }
    }

    function saveMessage(message, mediaPreviewContainer) {
        // Add the new message to the messages array
        messages.push(message);

        // Save the updated messages array in localStorage
        localStorage.setItem('messages', JSON.stringify(messages));

        displayMessage(message);

        textarea.value = '';
        mediaInput.value = '';
        createButton.disabled = true;
    }

    function displayMessages() {
        for (let i = 0; i < messages.length; i++) {
            displayMessage(messages[i]);
        }
    }

    function displayMessage(message) {
        const div = document.createElement('div');
        div.className = 'message-div';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content-div';
        div.appendChild(contentDiv);

        const topDiv = document.createElement('div');
        topDiv.className = 'top-div';
        contentDiv.appendChild(topDiv);

        const midDiv = document.createElement('div');
        midDiv.className = 'mid-div';
        contentDiv.appendChild(midDiv);

        const botDiv = document.createElement('div');
        botDiv.className = 'bot-div';
        contentDiv.appendChild(botDiv);

        // Additional elements and customizations can be added here
        // For example:

        const image = document.createElement('img');
        image.src = '../images/ricky.jpg';
        image.id = 'prof-pic';
        topDiv.appendChild(image);

        const p = document.createElement('p');
        p.textContent = 'Your_username';
        p.id = 'username';
        topDiv.appendChild(p);

        const dot = document.createElement('span');
        dot.id = 'punct';
        dot.textContent = '.';
        topDiv.appendChild(dot);

        const timestamp = document.createElement('p');
        timestamp.id = 'timp';
        const startTime = new Date(message.timestamp);
        timestamp.textContent = getTimePassed(startTime) + ' ago';
        topDiv.appendChild(timestamp);

        const span = document.createElement('span');
        span.textContent = message.message;
        span.id = 'mesaj';
        midDiv.appendChild(span);

        const mediaContainer = document.createElement('div');

        for (let i = 0; i < message.mediaFiles.length; i++) {
            const media = document.createElement('img');
            media.src = message.mediaFiles[i];
            media.id = 'mediafile';
            mediaContainer.appendChild(media);
        }
        midDiv.appendChild(mediaContainer);

        const likes = document.createElement('div');
        likes.className = 'likes';

        const likesCount = document.createElement('span');
        likesCount.className = 'likes-count';
        likesCount.textContent = message.likes + (message.likes === 1 ? ' like' : ' likes');
        likes.appendChild(likesCount);

        const likeButton = createLikeButton(message, likesCount);
        likeButton.id = 'button';
        likes.appendChild(likeButton);

        botDiv.appendChild(likes);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.id = 'delete-butoon';
        deleteButton.addEventListener('click', function () {
            const index = messages.findIndex(m => m === message);
            if (index !== -1) {
                messages.splice(index, 1); // Remove the message from the messages array
                localStorage.setItem('messages', JSON.stringify(messages)); // Store the updated messages array in localStorage
                div.remove(); // Remove the div from the DOM
            }
        });
        botDiv.appendChild(deleteButton);

        messageContainer.prepend(div);
    }

    function createLikeButton(message, likesCount) {
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        if (message.liked) {
            likeButton.classList.add('liked');
        }
        likeButton.innerHTML = `
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21.35L10.55 20.03C5.59 15.73 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.16 3 10.74 3.81 12 5.09C13.26 3.81 14.84 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.41 15.73 13.45 20.04L12 21.35Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    `;
        likeButton.addEventListener('click', function () {
            if (message.liked) {
                message.likes--;
                message.liked = false;
            } else {
                message.likes++;
                message.liked = true;
            }
            updateLikesCount(likesCount, message.likes);
            likeButton.classList.toggle('liked');
        });
        return likeButton;
    }

    // Function to calculate the time passed since the div was displayed
    function getTimePassed(startTime) {
        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - startTime.getTime();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return days + ' d';
        } else if (hours > 0) {
            return hours + ' h';
        } else if (minutes > 0) {
            return minutes + ' m';
        } else {
            return seconds + ' s';
        }
    }

    function updateLikesCount(likesCount, count) {
        likesCount.textContent = count + (count === 1 ? ' like' : ' likes');
        localStorage.setItem('messages', JSON.stringify(messages));
    }
});