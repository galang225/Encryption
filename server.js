const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Support file gede
app.use(express.static('public')); // Load frontend dari folder public

// API ENCRYPT (Logika Aman di Server)
app.post('/api/encrypt', (req, res) => {
    const { code, type, style } = req.body;

    if (!code) return res.status(400).json({ success: false, message: "No code provided" });

    try {
        let hasil = `/* Encrypted by GalangHost Secure Backend | ${new Date().toLocaleString()} */\n`;

        if (type === 'html') {
            if (style === 'hex') {
                // Logika Hexadecimal di Server
                hasil += "<script>document.write(unescape('" + escape(code) + "'))<\/script>";
            } else {
                // Logika Unicode/Base64 di Server
                let b64 = Buffer.from(code).toString('base64');
                hasil += `<script>document.write(decodeURIComponent(escape(atob('${b64}'))))<\/script>`;
            }
        } 
        else if (type === 'js') {
            // JS Enc: Base64 Obfuscation
            let b64js = Buffer.from(code).toString('base64');
            hasil += `eval(atob("${b64js}"));`;
        }
        else if (type === 'css') {
            // CSS Obfuscation
            let b64css = Buffer.from(code).toString('base64');
            hasil += `(function(){var s=document.createElement('style');s.innerHTML=atob('${b64css}');document.head.appendChild(s);})();`;
        }

        res.json({ success: true, result: hasil });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GalangHost Server jalan di port ${PORT}`));


