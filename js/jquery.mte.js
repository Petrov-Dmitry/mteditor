function mte(textarea, options) {
    "use strict";

    this.default_language = 'ru';
    this.default_mode = 'visual';
    var _this = this;
    this.$textarea = $(textarea);

    // Try to get options
    if (options === undefined) {
        this.options = {};
    } else {
        this.options = options;
    }
    // Set options
    this.options.uploaderUrl = this.options.uploaderUrl || '/upload/add/images/';
    this.toolbarButtons = this.options.toolbarButtons || this.toolbarButtons;
    this.language = this.options.language || this.default_language;
    this.options.mode = this.options.mode || this.default_mode;

    // Wrap the editor
    this.$textarea.wrap('<div class="mte_wrapper mte-lang_' + this.language + '"></div>');
    this.$wrapper = this.$textarea.parent('.mte_wrapper');
    this.$wrapper.width(this.$textarea.width());

    // Add the editable block with content from TEXTAREA
    $(textarea).after('<div class="mte_div"></div>');
    this.$div = this.$textarea.siblings('.mte_div');
    this.$div.attr('contenteditable', 'true');
    this.$div.html(this.$textarea.html());

    // Set width and height of editable block
    this.$div.width(this.$textarea.width() - (this.$div.outerWidth() - this.$div.width()));
    this.$div.height(this.$textarea.height() - (this.$div.outerHeight() - this.$div.height()));
    this.$div.blur(function () {
        if (_this.mode === 'visual') {
            _this.$textarea.val(_this.$div.html());
        }
    });

    // Bind the reaction on events
    this.$div.bind('keyup click', function (e) {
        var $node = $(_this.getSelectionStartNode());
        // Proceed the links
        if ($node.is('a')) {
            _this.showModal('link-form');
            $('.mte_modal [name=name]').val($node.text());
            $('.mte_modal [name=url]').val($node.attr('href'));

            $('.mte_modal_submit').click(function () {
                var name = $('.mte_modal [name=name]').val();
                var url = $('.mte_modal [name=url]').val();
                $node.text(name);
                $node.attr('href', url);
                _this.closeModal();
            });
        }
    });

    // Making menu-toolbar
    this.$textarea.before(this.getTemplate('toolbar'));
    this.$div.after(this.getTemplate('switch'));

    // Add buttons in the toolbar
    for (var i=0; i<this.toolbarButtons.length; ++i){
        var name = this.toolbarButtons[i];
        this.addToolbarButton(name);
        this.getButton(name).click( $.proxy(this.plugins[name], this) );
    }

    this.$div.blur(function () {
        _this.saveSelection();
    });

    $('.mte_switch_html', this.$wrapper).click(function () {
        _this.htmlMode();
        return false;
    });

    $('.mte_switch_visual', this.$wrapper).click(function () {
        _this.visualMode();
        return false;
    });


    // AJAX image uploading
    this.templates['image-form'] = this.templates['image-form'].replace('{{UPLOADER_URL}}', this.options.uploaderUrl);
}

mte.prototype = {
    toolbarButtons: [
        'bold',
        'italic',
        'strike',
        'underline',
        'ol',
        'ul',
        'l_up',
        'l_down',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'image',
        'link',
        'removeformat'
    ],

    plugins: {
        'bold': function () {
            document.execCommand('Bold', false, true);
            this.$div.focus();
            return false;
        },

        'italic': function () {
            document.execCommand('Italic', false, true);
            this.$div.focus();
            return false;
        },

        'strike': function () {
            document.execCommand('StrikeThrough', false, true);
            this.$div.focus();
            return false;
        },

        'underline': function () {
            document.execCommand('Underline', false, true);
            this.$div.focus();
            return false;
        },

        'ol': function () {
            document.execCommand('InsertOrderedList', false, true);
            this.$div.focus();
            return false;
        },

        'ul': function () {
            document.execCommand('InsertUnorderedList', false, true);
            this.$div.focus();
            return false;
        },

        // Переместить элементы списка на уровень вверх
        'l_up': function() {
            listType = this.savedRange.startContainer.parentElement.parentElement.localName;    // UL or OL
            listElement = this.savedRange.startContainer.parentElement;                         // selected UL or OL

            // Если не на первом уровне вложенности, то обрежем тег-родитель для parentElement
            isFirstLevel = this.savedRange.startContainer.parentElement.parentElement.parentElement.localName !== listType;
            if (!isFirstLevel) {
                // Получаем список (ul или ol) с выделенными вложениями
                list = $(listElement).parent();

                // Выясняем есть ли в списке элементы перед и после выбранных
                beforeList = $(this.savedRange.startContainer.parentElement).prevAll();
                isBefore = Boolean(beforeList.length);
                afterList = $(this.savedRange.endContainer.parentElement).nextAll();
                isAfter = Boolean(afterList.length);

                // Получим список выделенных фрагментов
                selectedElements = this.getSelectedHtml();

                // если нет элементов ни до, ни после выбранных
                if (isBefore == false && isAfter == false) {
                    list.before(selectedElements).remove();

                // если есть элементы до и после выбранных
                } else if (isBefore == true && isAfter == true) {
                    afterList = afterList.remove();
                    selectedElements = $(selectedElements).remove();
                    beforeList = list.children();

                    list.before($('<'+ listType +'>').append(beforeList));
                    list.before(selectedElements);
                    list.before($('<'+ listType +'>').append(afterList));

                    afterList = list.nextAll('ol, ul, li').remove();
                    list.before(afterList);
                    list.remove();

                // если нет элементов перед выбранными
                } else if (isBefore == false && isAfter == true) {
                    list.before($(selectedElements).remove());
                    list.after(list.next('ul, ol, li').remove());

                // если нет элементов после выбранных
                } else if (isBefore == true && isAfter == false) {
                    selectedElements = $(selectedElements).remove();
                    listAfter = list.nextAll().remove();
                    list.after(listAfter).after(selectedElements);
                }

                // Если список остался пустым - удалить
                if (!list.children().length) {
                    list.remove();
                }
            }

            this.$div.focus();
            return false;
        },

        // Переместить элементы списка на уровень вниз
        'l_down': function() {
            listType = this.savedRange.startContainer.parentElement.parentElement.localName;
            listElement = this.savedRange.startContainer.parentElement;

            // Получаем список (ul или ol) с выделенными вложениями
            list = $(listElement).parent();

            // Найти соседние списки
            listBefore = $(listElement).prev(listType);
            listAfter = $(listElement).next(listType);

            // Получим список выделенных фрагментов
            selectedElements = this.getSelectedHtml();

            // Если перед и после элементов нет списков
            if (Boolean(listBefore.length) === false && Boolean(listAfter.length) === false) {
                // Обернем выбранные элементы в список
                $(selectedElements).wrapAll('<'+ listType +'></'+ listType +'>');
            // Если есть списки и до, и после элементов
            } else if (Boolean(listBefore.length) === true && Boolean(listAfter.length) === true) {
                // Сформируем новый список
                newList = $('<'+listType+'></'+listType+'>')
                            .append(listBefore.children())
                            .append(selectedElements)
                            .append(listAfter.children());
                // Запишем новый список
                listBefore.before(newList);
                // Почистим "обрезки"
                listBefore.remove();
                listAfter.remove();
            // Если список только сверху
            } else if (Boolean(listBefore.length) === true && Boolean(listAfter.length) === false) {
                // допишем выбранные элементы в конец списка сверху
                listBefore.append(selectedElements);
            // Если список только снизу
            } else if (Boolean(listBefore.length) === false && Boolean(listAfter.length) === true) {
                // допишем выбранные элементы в начало списка снизу
                listAfter.prepend(selectedElements);
            }

            this.$div.focus();
            return false;
        },

        'h1': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h1>');
            this.$div.focus();
            return false;
        },

        'h2': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h2>');
            this.$div.focus();
            return false;

        },

        'h3': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h3>');
            this.$div.focus();
            return false;
        },

        'h4': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h4>');
            this.$div.focus();
            return false;
        },

        'h5': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h5>');
            this.$div.focus();
            return false;
        },

        'h6': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h6>');
            this.$div.focus();
            return false;
        },

        'image': function() {
            this.showModal('image-form');
            var _this = this;
            $('.mte_modal_submit').click(function () {
                var url = $('.mte_modal [name=url]').val();
                _this.closeModal();

                _this.restoreSelection();
                _this.insertHtml('<img src="' + url + '" />');
            });
        },

        'link': function() {
            this.showModal('link-form');
            var text = this.getSelectedText();
            if (text) {
                $('.mte_modal [name=name]').val(text);
            }
            var _this = this;
            $('.mte_modal_submit').click(function () {
                var name = $('.mte_modal [name=name]').val();
                var url = $('.mte_modal [name=url]').val();
                _this.closeModal();

                _this.restoreSelection();
                _this.insertHtml('<a href="' + url + '">' + name + '</a>');
            });
        },

        'removeformat': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<p>');
            this.$div.focus();
            return false;
        }
    },

    templates: {
        'toolbar': '<ul class="mte_toolbar">\
            </ul>\
            <div style="clear: left;"></div>',

        'switch': '<div class="mte_switch">\
                <a class="mte_switch_html" href="#">{{toolbar.html_mode}}</a>\
                <a class="mte_switch_visual" href="#">{{toolbar.visual_mode}}</a>\
            </div>',

        'modal': '<div class="mte_modal"><div class="mte_modal_close"></div></div>',

        'modal-background': '<div class="mte_modal_background"></div>',

        'image-form': '<h1>{{modal.insert_image}}</h1>\
            <form class="pancil_modal_img_form" action="{{UPLOADER_URL}}" method="POST" enctype="multipart/form-data" >\
                <table>\
                    <tr>\
                        <td>{{modal.image}}:</td>\
                        <td>\
                            <input type="file" name="file" /><br />\
                        </td>\
                    </tr>\
                    <tr>\
                        <td><small>{{modal.or}}</small></td>\
                        <td></td>\
                    </tr>\
                    <tr>\
                        <td>{{modal.link}}:</td>\
                        <td><input type="text" name="url" size="40" value="" /></td>\
                    </tr>\
                    <tr colspan="2">\
                        <td>\
                            <input type="button" value="{{modal.insert}}" class="mte_modal_submit" />\
                            <input type="button" value="{{modal.cancel}}" class="mte_modal_cancel" />\
                        </td>\
                    </tr>\
                </table>\
            </form> ',

        'link-form': '<h1>{{modal.insert_link}}</h1>\
            <table>\
                <tr>\
                    <td>{{modal.name}}:</td>\
                    <td><input type="text" name="name" size="40" /></td>\
                </tr>\
                <tr>\
                    <td>{{modal.link}}:</td>\
                    <td><input type="text" name="url" size="40" value="http://" /></td>\
                </tr>\
                <tr colspan="2">\
                    <td>\
                        <input type="button" value="{{modal.insert}}" class="mte_modal_submit" />\
                        <input type="button" value="{{modal.cancel}}" class="mte_modal_cancel" />\
                    </td>\
                </tr>\
            </table>'
    },

    translations: {
        'en':{
            'toolbar.bold': 'Bold',
            'toolbar.italic': 'Italic',
            'toolbar.strike': 'Strike',
            'toolbar.underline': 'Underline',
            'toolbar.ol': 'Ordered List',
            'toolbar.ul': 'Unordered List',
            'toolbar.l_up': 'List level up',
            'toolbar.l_down': 'List level down',
            'toolbar.h1': 'Headline 1',
            'toolbar.h2': 'Headline 2',
            'toolbar.h3': 'Headline 3',
            'toolbar.h4': 'Headline 4',
            'toolbar.h5': 'Headline 5',
            'toolbar.h6': 'Headline 6',
            'toolbar.image': 'Image',
            'toolbar.link': 'Link',
            'toolbar.removeformat': 'Remove Format',

            'toolbar.html_mode': 'Switch to HTML Mode',
            'toolbar.visual_mode': 'Switch to Visual Mode',

            'modal.insert': 'Insert',
            'modal.cancel': 'Cancel',
            'modal.insert_image': 'Image',
            'modal.insert_link': 'Link',
            'modal.image': 'Image',
            'modal.link': 'Link',
            'modal.or': 'or',
            'modal.name': 'Name',
            'modal.html_code': 'HTML code'
        },
        'ru':{
            'toolbar.bold': 'Жирный',
            'toolbar.italic': 'Курсив',
            'toolbar.strike': 'Зачеркнутый',
            'toolbar.underline': 'Подчеркивание',
            'toolbar.ol': 'Нумерованый список',
            'toolbar.ul': 'Ненумерованный список',
            'toolbar.l_up': 'На уровень выше',
            'toolbar.l_down': 'На уровень ниже',
            'toolbar.h1': 'Заголовок 1',
            'toolbar.h2': 'Заголовок 2',
            'toolbar.h3': 'Заголовок 3',
            'toolbar.h4': 'Заголовок 4',
            'toolbar.h5': 'Заголовок 5',
            'toolbar.h6': 'Заголовок 6',
            'toolbar.image': 'Изображение',
            'toolbar.link': 'Ссылка',
            'toolbar.removeformat': 'Очистить форматирование',

            'toolbar.html_mode': 'Переключить в режим HTML',
            'toolbar.visual_mode': 'Переключить в визуальный режим',

            'modal.insert': 'Вставить',
            'modal.cancel': 'Отмена',
            'modal.insert_image': 'Вставка изображения',
            'modal.insert_link': 'Вставка ссылки',
            'modal.image': 'Изображение',
            'modal.link': 'Ссылка',
            'modal.or': 'или',
            'modal.name': 'Название',
            'modal.html_code': 'HTML код'
        }
    },

    translate: function (name) {
        return this.translations[this.language][name] ||  this.translations[this.default_language][name]
    },

    getTemplate: function (name) {
        var html = this.templates[name];
        var context = this.translations[this.language];
        return this.renderTemplate(html, context);
    },

    renderTemplate: function (html, context){
        var tokens = html.match(/{{[\w\._]+}}/g) || [];
        for (var i=0; i<tokens.length; ++i){
            var token = tokens[i];
            var name = token.slice(2,-2);
            html = html.replace(token, context[name]);
        }
        return html;
    },

    addPlugin: function(name, func){
        this.toolbarButtons.push(name);
        this.plugins[name] = func;
    },

    addToolbarButton: function (name) {
        var btn = $('<li><a class="mte_toolbar_button mte_toolbar_button__' + name + '" href="#" title="' + this.translate('toolbar.'+name) + '"></a></li>');
        this.getToolbar().append(btn);
    },

    getToolbar: function () {
        return $('.mte_toolbar', this.$wrapper);
    },

    getButton: function (name) {
        return $('.mte_toolbar_button__' + name, this.$wrapper);
    },

    insertHtml: function (html) {
        document.execCommand('InsertHtml', false, html);
    },

    htmlMode: function () {
        if (this.mode === 'html') {
            return;
        }
        console.log(this);
        if (this.options.mode !== 'html') {
            this.$textarea.val(this.$div.html());
        }
        this.$textarea.show();
        this.$div.hide();
        $('.mte_switch_html', this.$wrapper).hide();
        $('.mte_switch_visual', this.$wrapper).show();
        $('.mte_toolbar', this.$wrapper).hide();

        this.mode = 'html';
    },

    visualMode: function () {
        if (this.mode === 'visual') {
            return;
        }
        this.$div.html(this.$textarea.val());
        this.$textarea.hide();
        this.$div.show();
        $('.mte_switch_visual', this.$wrapper).hide();
        $('.mte_switch_html', this.$wrapper).show();
        $('.mte_toolbar', this.$wrapper).show();

        this.mode = 'visual';
    },

    showModal: function (templateName) {
        var bg = $(this.getTemplate('modal-background'));
        var modal = $(this.getTemplate('modal'));

        $('body').append(bg);
        $('body').append(modal);
        var content = this.getTemplate(templateName);
        modal.append(content);

        var left = $(window).width() / 2 - modal.width() / 2;
        var top = $(window).height() / 2 - modal.height() / 2;
        modal.css('left', left);
        modal.css('top', top);

        var _this = this;
        $('.mte_modal_close,.mte_modal_cancel').click(function () {
            _this.closeModal();
        });
        $(document).keyup(function (e) {
            if (e.keyCode === 27) {
                _this.closeModal();
            }
        });
    },

    closeModal: function () {
        $('.mte_modal').remove();
        $('.mte_modal_background').remove();
    },

    getSelectionStartNode: function () {
        //http://stackoverflow.com/questions/2459180/how-to-edit-a-link-within-a-contenteditable-div
        var node, selection;
        if (window.getSelection) { // FF3.6, Safari4, Chrome5 (DOM Standards)
            selection = window.getSelection();
            node = selection.anchorNode;
        }
        if (!node && document.selection) { // IE
            selection = document.selection;
            var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
            node = (range.commonAncestorContainer || range.parentElement) ? range.parentElement() : range.item(0);
        }
        if (node) {
            return (node.nodeName === "#text" ? node.parentNode : node);
        }
    },

    getSelectedText: function () {
        // http://stackoverflow.com/questions/5669448/get-selected-texts-html-in-div
        if (typeof window.getSelection !== "undefined") {
            // IE 9 and other non-IE browsers
            return window.getSelection().toString();
        }
        if (document.selection && document.selection.type !== "Control") {
            // IE 8 and below
            return document.selection;
        }
    },

    getSelectedHtml: function() {
        var selection = window.getSelection();
        //console.log('This is getSelectedHtml()', selection);
        if( selection ) {
            var range = (document.all ? selection.createRange() : selection.getRangeAt(selection.rangeCount - 1).cloneRange());
            //console.log('range', range);

            // Получим первый и последний выделенные элементы
            startElement = $(range.startContainer).parent();
            endElement = $(range.endContainer).parent();
            // Получим список элементов между первым и последним
            listElements = startElement.nextAll().not(endElement).not($(endElement).nextAll());

            // Построим единый список выделенных элементов
            // Если есть betweenElements - объеденим их с startElement
            if (listElements.length > 0) {
                listElements = $.merge(startElement.get(), listElements.get());
            } else {
                listElements = startElement.get();
            }
            // Если первый и последний элементы - не одно и то-же
            if (startElement.get(0) !== endElement.get(0)) {
                listElements = $.merge(listElements, endElement.get());
            }
            return listElements;
        }
    },

    saveSelection: function () {
        //http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
        if (window.getSelection) {
            //non IE Browsers
            this.savedRange = window.getSelection().getRangeAt(0);
        } else if (document.selection) {
            //IE
            this.savedRange = document.selection.createRange();
        }
    },

    restoreSelection: function () {
        //http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
        this.$div.focus();
        if (this.savedRange !== null) {
            if (window.getSelection) {
                //non IE and there is already a selection
                var s = window.getSelection();
                if (s.rangeCount > 0) {
                    s.removeAllRanges();
                }
                s.addRange(this.savedRange);
            } else if (document.createRange) {
                //non IE and no selection
                window.getSelection().addRange(this.savedRange);
            } else if (document.selection) {
                //IE
                this.savedRange.select();
            }
        }
    }
};

(function ($) {
    "use strict";

    $.fn.mte = function (options) {
        var editor = new mte(this, options);
        if (options && options.mode === 'html') {
            editor.htmlMode();
        } else {
            editor.visualMode();
        }
        return editor;
    };
}(jQuery));
