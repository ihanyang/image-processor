<template>
	<label class="img-container" :data-text="text" v-show="! url">
		<input type="file" accept="image/*" capture @change="getImage" v-el:input>
	</label>
	<img :src="url" v-show="stage === 3" @click="changeImage" v-el:img>
	<p class="stage" v-if="stage === 1">正在读取图片...</p>
	<div class="progress" v-if="stage === 2">
		<div class="progress-bar" :style="{width: progressWidth}"></div>
	</div>
</template>

<script>
	import {compressImage} from "../utils/compress"

	export default {
		props: ["text", "stage", "uploadLink", "response", "webp"],
		data() {
			return {
				message: "",
				url: "",
				progressWidth: "",
			}
		},
		methods: {
			getImage(e) {
				const [file] = e.target.files
				// let {name, type, size} = file

				// if (size > 1 * 1024 * 1024) {
				// 	this.message = `图片大小不能超过${this.maxSize}MB！`

				// 	return
				// }

				this.stage = 1

				window.URL = window.URL || window.webkitURL

				this.url = window.URL.createObjectURL(file)

				// 0 原图上传  1 压缩  2 压缩且转webp

				let compressLevel = this.webp

				if (navigator.userAgent.match(/UCBrowser/)) {
					compressLevel = 0
				}

				compressImage({
					file,
					compressLevel
				}).then((data) => {
					const {blob, name} = data

					this.stage = 2

					this.upload(blob, name).then((data) => {
						this.response = data
					})
				}).catch((e) => {
					console.error(e)
				})
			},
			upload(file, name) {
				return new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest(),
						formdata = new FormData()

					formdata.append("image", file, name)

					// 另外需要的参数  可选
					formdata.append("callback", "callback")

					xhr.onload = () => {
						if (xhr.status === 200 && xhr.status < 300 || xhr.status === 304) {
							this.progressWidth = ""
							this.stage = 3

							try {
								const data = JSON.parse(xhr.responseText)

								resolve(data)
							} catch(e) {
								console.log("%c数据解析失败", "font: 14px 微软雅黑; color: #F14382")

								reject(new Error(xhr.statusText))
							}
						} else {
							reject(new Error(xhr.statusText))
						}
					}

					xhr.upload.onprogress = (e) => {
						e.lengthComputable && (this.progressWidth = `${(e.loaded / e.total) * 100}%`)
					}

					xhr.open("POST", this.uploadLink)
					xhr.send(formdata)
				})
			},
			changeImage() {
				this.$els.input.click()
			}
		}
	}
</script>