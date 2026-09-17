const categories = {
    learning: [
        "course", "pdf", "learn", "learning", "study",
        "tutorial", "notes", "material", "training",
        "certificate", "python", "java", "coding",
        "programming", "machine learning", "data science"
    ],

    professional: [
        "job", "career", "work", "project", "internship",
        "opportunity", "company", "resume", "cv",
        "experience", "skills", "developer", "business",
        "hiring", "recruiter", "interview"
    ],

    contact: [
        "phone number", "mobile number", "whatsapp",
        "telegram", "instagram", "snapchat",
        "contact number", "give me your number",
        "send me your number"
    ],

    romantic: [
        "love", "lover", "relationship", "girlfriend",
        "boyfriend", "date", "dating", "crush",
        "marry", "marriage", "i like you",
        "i miss you", "beautiful", "handsome",
        "sweetheart", "darling", "honey"
    ],

    scam: [
        "send money", "pay me", "investment",
        "guaranteed profit", "otp", "password",
        "verification code", "bank account",
        "credit card", "urgent payment",
        "money transfer"
    ]
};


function normalize(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}


function calculateScores(text) {

    const scores = {
        learning: 0,
        professional: 0,
        contact: 0,
        romantic: 0,
        scam: 0
    };

    for (const category in categories) {

        for (const keyword of categories[category]) {

            if (text.includes(keyword)) {
                scores[category]++;
            }

        }

    }

    return scores;
}


function analyzeMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();

    if (!message) {

        alert("Please paste a message first.");

        return;
    }


    const text =
        normalize(message);

    const scores =
        calculateScores(text);


    let category = "OTHER";
    let risk = "LOW";
    let confidence = 50;

    let reason =
        "The system could not clearly determine the intention.";


    if (scores.scam > 0) {

        category = "SCAM / SUSPICIOUS";

        risk = "HIGH";

        confidence =
            Math.min(95, 75 + scores.scam * 5);

        reason =
            "This message contains indicators related to money, credentials, OTP, or other potentially risky requests.";
    }


    else if (scores.romantic > 0) {

        category = "ROMANTIC / PERSONAL";

        risk = "HIGH";

        confidence =
            Math.min(95, 75 + scores.romantic * 5);

        reason =
            "This conversation appears to contain personal or romantic language rather than a professional purpose.";
    }


    else if (scores.contact > 0) {

        category = "CONTACT REQUEST";

        risk = "MEDIUM";

        confidence =
            Math.min(90, 65 + scores.contact * 5);

        reason =
            "The sender appears to be requesting personal contact information.";
    }


    else if (
        scores.learning > 0 &&
        scores.professional > 0
    ) {

        category = "LEARNING / PROFESSIONAL";

        risk = "LOW";

        confidence = 90;

        reason =
            "The message appears to have a professional or educational purpose.";
    }


    else if (scores.learning > 0) {

        category = "LEARNING / EDUCATIONAL";

        risk = "LOW";

        confidence =
            Math.min(95, 75 + scores.learning * 5);

        reason =
            "The message appears related to learning, courses, study material, or education.";
    }


    else if (scores.professional > 0) {

        category = "PROFESSIONAL";

        risk = "LOW";

        confidence =
            Math.min(95, 75 + scores.professional * 5);

        reason =
            "The message appears to be related to work, career, projects, or professional opportunities.";
    }


    showResult(
        category,
        risk,
        confidence,
        reason
    );


    saveHistory(
        message,
        category,
        risk
    );
}


function showResult(
    category,
    risk,
    confidence,
    reason
) {

    const result =
        document.getElementById("result");

    const icon =
        document.getElementById("resultIcon");

    const categoryElement =
        document.getElementById("resultCategory");

    const riskElement =
        document.getElementById("riskLevel");

    const reasonElement =
        document.getElementById("reason");

    const confidenceBar =
        document.getElementById("confidenceBar");

    const confidenceText =
        document.getElementById("confidenceText");


    result.classList.remove("hidden");


    if (risk === "HIGH") {

        icon.innerText = "🚨";

    }

    else if (risk === "MEDIUM") {

        icon.innerText = "⚠️";

    }

    else {

        icon.innerText = "✅";
    }


    categoryElement.innerText =
        category;

    riskElement.innerText =
        risk;

    reasonElement.innerText =
        reason;

    confidenceBar.style.width =
        confidence + "%";

    confidenceText.innerText =
        confidence + "%";


    if (risk === "HIGH") {

        riskElement.style.color =
            "#c62828";

    }

    else if (risk === "MEDIUM") {

        riskElement.style.color =
            "#ef6c00";

    }

    else {

        riskElement.style.color =
            "#2e7d32";
    }
}


function dismissResult() {

    document
        .getElementById("result")
        .classList.add("hidden");
}


function blockDemo() {

    alert(
        "Demo Block Action\n\n" +
        "The user's decision has been recorded.\n\n" +
        "This prototype does not automatically block anyone on LinkedIn."
    );
}


function saveHistory(
    message,
    category,
    risk
) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "safeConnectHistory"
            )
        ) || [];


    history.unshift({

        message: message,

        category: category,

        risk: risk,

        time: new Date().toLocaleString()

    });


    if (history.length > 10) {

        history.pop();
    }


    localStorage.setItem(
        "safeConnectHistory",
        JSON.stringify(history)
    );


    displayHistory();
}


function displayHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "safeConnectHistory"
            )
        ) || [];


    const container =
        document.getElementById(
            "historyList"
        );


    if (history.length === 0) {

        container.innerHTML =
            '<p class="empty">No messages analyzed yet.</p>';

        return;
    }


    container.innerHTML = "";


    history.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "history-item";


        div.innerHTML = `

            <strong>${item.category}</strong>

            <div>
                ${escapeHTML(item.message)}
            </div>

            <small>
                Risk: ${item.risk} • ${item.time}
            </small>

        `;


        container.appendChild(div);

    });
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


displayHistory();
