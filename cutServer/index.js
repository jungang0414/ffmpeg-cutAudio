const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/clip-audio', upload.single('audioFile'), (req, res) => {
    const audioFile = req.file.path;
    const startTime = req.body.startTime;
    const duration = req.body.duration;
    const outputFile = `output-${Date.now()}.mp3`;


    ffmpeg(audioFile)
        .setStartTime(startTime) //開始時間
        .setDuration(duration)   //持續時間
        .output(outputFile)
        .on('end', () => {
            res.download(outputFile);
        })
        .on('error', (err) => {
            res.status(500).send(`剪輯錯誤: ${err.message}`);
        })
        .run();
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`伺服器運行 PORT: ${port}`)
})