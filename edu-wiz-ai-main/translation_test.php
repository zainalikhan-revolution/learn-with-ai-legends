<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translation API Debugger</title>
    <style>
        body {
            font-family: sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }

        textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
        }

        button {
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

        pre {
            background: #f4f4f4;
            padding: 15px;
            border: 1px solid #ddd;
            white-space: pre-wrap;
        }

        .success {
            color: green;
        }

        .error {
            color: red;
        }
    </style>
</head>

<body>
    <h1>🛠️ Translation API Debugger</h1>
    <p>Use this tool to verify if the server is returning translations correctly.</p>

    <h3>1. Enter Text to Translate</h3>
    <textarea id="inputText" placeholder="Type something here (e.g., Hello World)">Hello World</textarea>

    <h3>2. Select Target Language</h3>
    <select id="targetLang">
        <option value="ur">Urdu (ur)</option>
        <option value="en">English (en)</option>
    </select>

    <br><br>
    <button onclick="testTranslation()">🚀 Test Translation API</button>

    <h3>3. API Response (Raw JSON)</h3>
    <pre id="output">Waiting for test...</pre>

    <script>
        async function testTranslation() {
            const text = document.getElementById('inputText').value;
            const target = document.getElementById('targetLang').value;
            const output = document.getElementById('output');

            output.textContent = 'Testing...';
            output.className = '';

            try {
                const response = await fetch('api-v50.php?action=translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text, target: target })
                });

                const textResponse = await response.text();
                console.log("Raw Response:", textResponse);

                try {
                    const json = JSON.parse(textResponse);
                    output.textContent = JSON.stringify(json, null, 2);

                    if (json.translatedText) {
                        output.innerHTML += `\n\n<b class="success">✅ SUCCESS: Translation found!</b>`;
                        output.innerHTML += `\nResult: ${json.translatedText}`;
                    } else if (json.error) {
                        output.innerHTML += `\n\n<b class="error">❌ API ERROR: ${json.error}</b>`;
                    } else {
                        output.innerHTML += `\n\n<b class="error">⚠️ UNKNOWN FORMAT: 'translatedText' missing.</b>`;
                    }

                } catch (e) {
                    output.textContent = "CRITICAL: Server returned invalid JSON.\n\nRaw Output:\n" + textResponse;
                    output.className = 'error';
                }

            } catch (err) {
                output.textContent = "NETWORK ERROR: " + err.message;
                output.className = 'error';
            }
        }
    </script>
</body>

</html>