const fs = require("fs")
const path = require("path")
const express = require("express")
const formidable = require("formidable")

const app = express()

app.use(express.static(__dirname))

app.post("/upload", (req, res) => {
	const form = new formidable.IncomingForm()

	form.uploadDir = __dirname

	form.on("file", (name, file) => {
		const filename = file.name
		const host = req.headers.origin

		fs.rename(file.path, __dirname + "/uploads/" + filename)

		res.json({
			url: `${host}/uploads/${filename}`
		})
	})

	form.parse(req)
})

app.listen(process.env.PORT || 9000)