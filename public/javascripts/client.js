var cookiesLifeExpectancy = 7;
var messagesElement = document.getElementById('messages');
var messageInput = document.getElementById('message-input');
var form = document.getElementById('form');
var socket = io();

function renderMessage (message) {
    var msg = JSON.parse(message);

    var messageHTML = [
        '<li class="row">',
            '<small class="time">', Format.getTime(msg.t), ' </small>',
            '<span class="name">', msg.n, '</span>',
            '<p class="msg">', msg.m, '</p>',
        '</li>'
    ].join('');

    messagesElement.insertAdjacentHTML('beforeend', messageHTML);
}

function scrollToBottom () {
    window.scrollTo(0, document.body.scrollHeight);
}

function loadMessages () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/messages', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                data.forEach(function (msg) {
                    renderMessage(msg);
                });
                scrollToBottom();
            }
        }
    };
    xhr.send();
}

function getName () {
    var name = Cookies.get('name');

    if (!name || name === 'null') {
        name = Format.getName();
        Cookies.set('name', name, cookiesLifeExpectancy);
    }
    socket.emit('io:name', name);
    messageInput.focus();

    return name;
}

function onFormSubmit (event) {
    event.preventDefault();

    var msg = messageInput.value;
    var noMessage = msg.match(/^[\s]*$/) !== null;
    var noName =
        !Cookies.get('name') ||
        Cookies.get('name').length < 1 ||
        Cookies.get('name') === 'null';

    // if input is empty or white space do not send message
    if (noMessage) {
        // tmp
        console.log('please enter your message here');
    }

    if (noName) {
        return getName();
    }

    socket.emit('io:message', msg);
    messageInput.value = '';
}

function onMessageReceived (msg) {
    renderMessage(msg);
    scrollToBottom();
}

function onNewVisitor (name) {
    // tmp
    console.log(name + ' appeared');
}

document.addEventListener('DOMContentLoaded', function () {
    form.addEventListener('submit', onFormSubmit);
    window.addEventListener('resize',scrollToBottom );
    socket.on('chat:messages:latest', onMessageReceived);
    socket.on('chat:people:new', onNewVisitor);

    getName();
    loadMessages();
});