(function (factory) {
	/* Global define */
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(window.jQuery);
	}
}(function ($) {
	$.extend(true, $.summernote.lang, {
		'en-US': {
			tableContent: {
				tooltip: 'Content',
				refresh: 'Refresh'
			}
		},
	});

	$.extend($.summernote.plugins, {
		'tableContent': function (context) {
			var self = this;

			var ui = $.summernote.ui;
			var $note = context.layoutInfo.note;
			var $editor = context.layoutInfo.editor;
			var $editable = context.layoutInfo.editable;
			var $toolbar = context.layoutInfo.toolbar;

			var options = context.options;
			var lang = options.langInfo;

			context.memo('button.tableContent', function () {
				var button = ui.button({
					contents: '<i class="fa fa-map"></i>',
					tooltip: lang.tableContent.tooltip,
					container: false,

					click: function (e) {
						context.invoke('tableContent.insert');
					},
				});

				return button.render();
			});

			context.memo('button.tableContentRefresh', function () {
				var button = ui.button({
					contents: '<i class="fa fa-refresh"></i>',
					tooltip: lang.tableContent.refresh,
					container: false,

					click: function () {
						context.invoke('tableContent.refresh');
					},
				});

				return button.render();
			});

			this.initialize = function(){
				context.invoke('tableContent.prevent', $editable.find('[data-role="table-content"]'));
			};

			this.insert = function() {
				context.invoke("editor.insertContainer", function ($cnt) {
					context.invoke('tableContent.update', $cnt);
				});
			};

			this.refresh = function() {
				var rng = $.summernote.range.create($editable)
				if (rng.isCollapsed() && rng.isInsideContainer()) {
					var cnt = $(rng.commonAncestor()).closest('[data-cnt="container"]');
					if (cnt.length) {
						cnt.empty();

						context.invoke('tableContent.update', cnt);
					}
				}
			};

			this.update = function($cnt){
				var jContent = $('<ul data-level="1"></ul>');

				$editable.find('h2,h3,h4').each(function (index) {
					var jThis = $(this);

					if (jThis.text().length > 0) {
						var offset = this.tagName.replace(/^h+/i, '') - 1;

						if (offset < 1){
							offset = 1;
						}

						if (offset > 3){
							offset = 3;
						}

						while (jContent.data('level') < offset) {
							jContent = jContent.append('<li data-role="virtual"><ul id="tab'
								+ index + '" data-level="' + offset + '"></ul></li>').find('ul#tab' + index);
						}

						while (jContent.data('level') > offset) {
							jContent = jContent.closest('ul[data-level=' + offset + ']');
						}

						var id = 'tabcontent-' + (index + 1);
						jThis.attr('id', id);

						jContent.append('<li><a href="#' + id + '">' + jThis.text() + '</a></li>');
					}
				});

				jContent.closest('[data-level="1"]').find('ul').addBack().each(function(){
					var jThis = $(this);

					if (jThis.children('li:not([data-role="virtual"])').length < 1){
						jThis.attr('data-type', 'empty');
					}

					jThis.children('li:not([data-role="virtual"])').each(function(index, element){
						$(element).attr('value', index + 1);
					});
				});

				$cnt.attr('data-role', 'table-content');
				$cnt.append(jContent.closest('[data-level="1"]')[0].outerHTML);

				context.invoke('tableContent.prevent', $cnt);

				$note.val(context.invoke('code'));
				$note.change();
			};

			this.prevent = function ($cnt) {
				$cnt.find('a').click(function (jEvent) {
					jEvent.preventDefault();
					jEvent.stopPropagation();

					if (jEvent.ctrlKey){
						window.location.href = window.location.href.replace(/#.*$/, '') + $(this).attr('href');
					}

					return false;
				});
			};
		}
	});
}));
