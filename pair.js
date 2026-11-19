const express = require('express');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/code', async (req, res) => {
  const number = req.query.number;
  if (!number) return res.json({ error: 'Number nahi diya' });

  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({ auth: state, printQRInTerminal: false });
  sock.ev.on('creds.update', saveCreds);

  try {
    const code = await sock.requestPairingCode(number, "SHAZIXMD");
    res.json({ code: code });
  } catch (e) {
    res.json({ error: 'Dobara try karo' });
  }
});

app.listen(3000, () => console.log('Pair chal raha hai'));
