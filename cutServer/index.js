const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });


app.post('/clip-audio', upload.single('audioFile'), (req, res) => {
    const audioFile = req.file.path;
    const startTime = req.body.startTime;
    const duration = req.body.duration;
    const newFileName = req.body.newFileName;
    const outputFile = `/Users/Peterli/Desktop/${newFileName}.mp3`;


    ffmpeg(audioFile)
        .setStartTime(startTime) //開始時間
        .setDuration(duration)   //持續時間
        .output(outputFile)
        .on('end', () => {
            res.download(outputFile, (err) => {
                if (err) throw err;
                // 刪除暫存的檔案
                fs.unlinkSync(audioFile);
                // fs.unlinkSync(outputFile);
            });
        })
        .on('error', (err) => {
            res.status(500).send(`剪輯錯誤: ${err.message}`);
        })
        .run();
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`伺服器運行`)
})