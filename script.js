
const passwordInput = document.querySelector("#password");
const generateBtn = document.querySelector("#generate-btn");
const copyBtn = document.querySelector("#copy-btn");

const lengthInput = document.querySelector("#length");
const lengthValue = document.querySelector("#length-value");

const uppercaseInput = document.querySelector("#uppercase");
const lowercaseInput = document.querySelector("#lowercase");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");

const strengthText = document.querySelector("#strength-text");
const strengthBar = document.querySelector("#strength-bar");
const message = document.querySelector("#message");



function secureRandomInt(max) {
    const range = 0x100000000;
    const limit = range - (range % max);
    const values = new Uint32Array(1);
    let randomValue;

    do {
        crypto.getRandomValues(values);
        randomValue = values[0];
    } while (randomValue >= limit);

    return randomValue % max;
}


function generatePassword() {
    const length = Number(lengthInput.value);
    const characterSets = [];

    if (uppercaseInput.checked) {
        characterSets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if (lowercaseInput.checked) {
        characterSets.push("abcdefghijklmnopqrstuvwxyz");
    }

    if (numbersInput.checked) {
        characterSets.push("0123456789");
    }

    if (symbolsInput.checked) {
        characterSets.push("!@#$%^&*()-_=+[]{};:,.?");
    }

    if (characterSets.length === 0) {
        passwordInput.value = "";
        message.textContent = "Select at least one character type.";
        strengthText.textContent = "Not generated";
        strengthBar.style.width = "0%";
        return;
    }

    const allCharacters = characterSets.join("");
    const passwordCharacters = [];

    for (const set of characterSets) {
        passwordCharacters.push(set[secureRandomInt(set.length)]);
    }

    while (passwordCharacters.length < length) {
        passwordCharacters.push(
            allCharacters[secureRandomInt(allCharacters.length)]
        );
    }

    for (let i = passwordCharacters.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [passwordCharacters[i], passwordCharacters[j]] =
            [passwordCharacters[j], passwordCharacters[i]];
    }

    const password = passwordCharacters.join("");

    passwordInput.value = password;
    message.textContent = "";
    updateStrength(length, allCharacters.length);
}



function updateStrength(length, poolSize) {
    const entropy = length * Math.log2(poolSize);

    let strength;
    let width;
    let color;

    if (entropy < 28) {
        strength = "Very Weak";
        width = "15%";
        color = "#ef4444";
    } else if (entropy < 36) {
        strength = "Weak";
        width = "30%";
        color = "#f97316";
    } else if (entropy < 60) {
        strength = "Fair";
        width = "50%";
        color = "#eab308";
    } else if (entropy < 80) {
        strength = "Good";
        width = "75%";
        color = "#84cc16";
    } else {
        strength = "Strong";
        width = "100%";
        color = "#22c55e";
    }

    strengthText.textContent = strength;
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
}



generateBtn.addEventListener("click", generatePassword);

lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
});


copyBtn.addEventListener("click", async () => {
    if (!passwordInput.value) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordInput.value);
        message.textContent = "Password copied successfully!";
    } catch (error) {
        message.textContent =
            "Copy failed. Try using localhost or a secure connection.";
    }
});
