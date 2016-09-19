<template>
	<div class="wrap">
		<div class="bar">
			<label>
				<input type="radio" :value="0" v-model="webp">
				转jpg
			</label>
			<label>
				<input type="radio" :value="2" v-model="webp">
				转webp
			</label>
		</div>
		<image-processor :text="'上传照片'" :webp="webp" :stage.sync="stage" :upload-link="uploadURL" :response.sync="response"></image-processor>
		<p v-if="stage === 3">
			图片地址：
			<a target="_blank" :href="url" v-text="url"></a>
		</p>
	</div>
</template>

<script>
	import imageProcessor from "./components/image-processor.vue"

	export default {
		data() {
			return {
				uploadURL: "/upload",
				url: "",
				stage: 0,
				webp: 0,
				response: null
			}
		},
		components: {
			imageProcessor
		},
		watch: {
			response(data) {
				this.url = data.url
			},
			webp(value) {
				if (value === 0) {
					window.webp = false
				} else {
					window.webp = true
				}
			}
		}
	}
</script>