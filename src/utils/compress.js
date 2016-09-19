export const compressImage = (params) => {
	return new Promise((resolve, reject) => {
		const {file, compressLevel, minSize} = {
			compressLevel: 1,
			minSize: 500 * 1024,
			...params
		}

		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")
		const img = new Image()
		const {name, type} = file

		let blob = null
		let mime = ""

		if (compressLevel === 0) {
			blob = file
			mime = type

			resolve({
				blob,
				name: `${name.split(".")[0]}.${mime.split("/")[1]}`
			})

			return
		}

		if (compressLevel === 2) {
			mime = window.webp ? "image/webp" : "image/jpeg"
		} else if (compressLevel === 1) {
			mime = "image/jpeg"
		} else {
			mime = type
		}

		canvas.style.display = "none"

		window.URL = window.URL || window.webkitURL

		img.src = window.URL.createObjectURL(file)

		img.onload = () => {
			canvas.width = img.naturalWidth
			canvas.height = img.naturalHeight

			ctx.drawImage(img, 0, 0)

			const dataURL = atob(canvas.toDataURL(mime, 0.75).split(",")[1])
			let length = dataURL.length
			let buffer = ""

			const arrayBuffer = new Uint8Array(length)

			while (length--) {
				arrayBuffer[length - 1] = dataURL.charCodeAt(length - 1)
			}

			buffer = arrayBuffer.buffer

			blob = new Blob([buffer], {
				type: mime
			})

			compressLevel === 0 && (blob = file)

			resolve({
				blob,
				name: `${name.split(".")[0]}.${mime.split("/")[1]}`
			})
		}

		document.body.appendChild(canvas)
	})
}