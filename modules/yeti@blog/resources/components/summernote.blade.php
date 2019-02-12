@param($id, md5(microtime(true)))
@param($name, $id)
@param($type)
@param($text)
@param($url)

@param($parent)
@param($externals, false)

@section('css')
	@parent

	<link href="/css/summernote.css" rel="stylesheet">
@stop

@section('js')
	@parent

	<script src="/js/summernote.js"></script>
	<script type="text/javascript">
		(function(){
			var __PARENT__ = "{{ $parent }}";
			var __EXTERNALS__ = !!"{{ $externals }}";

			$(function(){
				var jRecipient = $('#{{ $id }}');
				if (jRecipient.length > 0) {

					jRecipient.summernote({
						height: (function () {
							return (__PARENT__.length > 0 ? $("#{{ $parent }}")
								: jRecipient.parent()).innerHeight();
						})() - 40,

						focus: true,

						toolbar: [
							['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
							['fontsize', ['fontsize']],

							__EXTERNALS__
								? ['insert', ['picture', 'video', 'link']]
								: undefined,

							['meta', ['style', 'ul', 'ol', 'paragraph', 'height']],
							['misc', ['undo', 'redo', 'fullscreen', 'help']],
						],

						popover: {
							image: [
								['imagesize', ['imageSize100', 'imageSizeAuto']],
								['remove', ['removeMedia']]
							],
							link: [
								['link', ['linkDialogShow', 'unlink']]
							],
						},

						dialogsInBody: true,
						dialogsFade: true,
						blockquoteBreakingLevel: 2,

						codeviewFilter: false,
						codeviewIframeFilter: true,

						callbacks: {
							onImageUpload: function (Files) {
								for (var i = 0; i < Files.length; i++) {
									$.ajax({
										url: '{{ $url  }}',
										type: 'POST',

										data: (function (File) {
											var data = new FormData();

											data.append('files[]', File);
											data.append('type', "{{ $type }}");

											return data;
										})(Files[i]),

										cache: false,
										contentType: false,
										processData: false,
										success: function (data) {
											var Image = document.createElement('img');
											Image.src = data.url;
											Image.alt = data.name;

											$("#{{ $id }}").summernote('insertNode', Image);
										}
									});
								}
							}
						}
					});
				}
			});
		})(jQuery);
	</script>
@stop

<textarea id="{{ $id }}" name="{{ $name }}">{{ $text }}</textarea>
