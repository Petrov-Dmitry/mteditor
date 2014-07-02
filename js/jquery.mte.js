/**
 * TODO:
 * багфикс
 * доработка частично-реализованного функционала
 * реализовать вставку и изменение таблиц с поддержкой:
 *  thead, tbody, tfoot, th, td, ориентации заголовков (в строку или в столбец)
 *  добавления нескольких столбцов или строк в конец или после позиции курсора
 * следить за валидностью и форматированием генерируемого HTML
 */

function mte(textarea, options) {
    "use strict";

    this.default_language = 'ru';
    this.default_mode = 'visual';
    this.default_menuDivider = '<span class="divider"></span>';

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
    this.options.menuDivider = this.options.menuDivider || this.default_menuDivider;

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
        var $nodes = _this.getSelectedHtml();
        console.log('\nCatch selection-event on '+ $nodes.length +' elements');
        console.log('Selected elements', $nodes);

        var menuButtons = _this.getToolbar().find('.mte_toolbar_button');
        var textFormatOptions = _this.getToolbar().find('.mte_toolbar_select[name="textFormat"]');

        /**
         * TODO:
         * отработать события на элементах, в том числе на списке выделенных элементов
         */
        // Если элементов множество
        if ($nodes.length > 1) {
            console.log('элементов множество', $nodes);
            //var $node = $(_this.getSelectionStartNode());
        // Если элемет один
        } else {
            var $node = $($nodes[0]);
            var tag = $nodes[0].tagName.toLowerCase();
            var button = _this.getButton(tag);
            /**
             * Отработка событий при выборе тех или иных элементов
             */
            switch (tag) {
                case 'b':
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('p');
                    break;
                case 'i':
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('p');
                    break;
                case 'strike':
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('p');
                    break;
                case 'u':
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('p');
                    break;
                // Ссылка
                case 'a':
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('p');
                    break;
                case 'p':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break
                case 'h1':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h2':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h3':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h4':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h5':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h6':
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'li':
                    var parentTag = $node.parent()[0].tagName.toLowerCase();
                    button = _this.getButton(parentTag);
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('divider');
                    break;
            }
        }
    });

    // Making menu-toolbar
    this.$textarea.before(this.getTemplate('toolbar'));
    this.$div.after(this.getTemplate('switch'));

    // Add buttons in the toolbar
    this.drawToolbar();

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
    /**
     * TODO: форматы текста перенести в SELECT
     * добавить обработку разделителей divider
     * сделать соответствующие изменения в структуре translations и функции drawToolbar
     */
    textFormats: [
        'h1','h2','h3','h4','h5','h6','divider',
        'p'
    ],
    toolbarButtons: [
        'textFormats','divider',
        'b','i','strike','u','divider',
        /**
         * TODO: работы по кнопкам списков вынесены в ветку lists
         */
        //'ol','ul','l_up','l_down','divider',
        'a','image'//,'divider',
        /**
         * TODO: look the clearFormat function description
         */
        //'removeformat'
    ],

    /**
     * TODO: см комментарий к toolbarButtons
     * добавить в плагин соответствующие методы
     */
    plugins: {
        'b': function () {
            console.log('Bold');
            this.getToolbar().find('.mte_toolbar_button').removeClass('active');
            document.execCommand('Bold', false, true);
            this.$div.focus();
            return false;
        },

        'i': function () {
            this.getToolbar().find('.mte_toolbar_button').removeClass('active');
            document.execCommand('Italic', false, true);
            this.$div.focus();
            return false;
        },

        'strike': function () {
            this.getToolbar().find('.mte_toolbar_button').removeClass('active');
            document.execCommand('StrikeThrough', false, true);
            this.$div.focus();
            return false;
        },

        'u': function () {
            this.getToolbar().find('.mte_toolbar_button').removeClass('active');
            document.execCommand('Underline', false, true);
            this.$div.focus();
            return false;
        },

        /**
         * TODO: для действий ol, ul
         * Выбирать либо элементы li, либо p - смешанный набор игнорировать
         * Элементы li, вырезать из списка.
         *  Если выбраны элементы в начале списка - вставить выбранные перед списком в виде абзацев
         *  Если выбраны элементы в конце списка - вставить выбранные после списка в виде абзацев
         *  Если выбраны элементы из середины списка - разбить список на 2, между ними вставить выбранные в виде абзацев
         * Элементы p
         *  следующие перед списком - вырезать и записать как li в начало списка
         *  следующие после списка - вырезать и записать как li в конец списка
         *  следующие вдали от списков - заменить новым списком (вырезать и записать как li в новый список).
         */
        'ol': function () {
            console.log('OL');
            selectedElements = this.getSelectedHtml();
            console.log('selectedElements', selectedElements);
            /*
            this.getToolbar().find('.mte_toolbar_button').removeClass('active');
            document.execCommand('InsertOrderedList', false, true);
            */
            this.$div.focus();
            return false;
        },

        'ul': function () {
            console.log('UL');
            selectedElements = this.getSelectedHtml();
            console.log('selectedElements', selectedElements);
            /*
            this.getToolbar().find('.mte_toolbar_button').removeClass('active');
            document.execCommand('InsertUnorderedList', false, true);
            */
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

        /**
         * Функции форматов текста
         */
        'h1': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h1>');
            _this.$div.focus();
            return false;
        },
        'h2': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h2>');
            _this.$div.focus();
            return false;

        },
        'h3': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h3>');
            _this.$div.focus();
            return false;
        },
        'h4': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h4>');
            _this.$div.focus();
            return false;
        },
        'h5': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h5>');
            _this.$div.focus();
            return false;
        },
        'h6': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<h6>');
            _this.$div.focus();
            return false;
        },
        'p': function () {
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<p>');
            _this.$div.focus();
            return false;
        },

        /**
         * TODO:
         * починить отображение ссылки (пути к файлу) на картинку в форме
         *
         * расширить форму картинки полями: alt, title, width, height,
         *  position - выравнивание: слева, справа, по центру,
         *  textWrap - обтекание текстом или есть или нет,
         *  showorigin - показывать или нет всплывашку с оригиналом
         * поле alt может показываться как подпись к картинке, title как заголовок подписи
         * остальные поля, если не заданы, должны использовать умолчания из настроек
         *
         * реализовать отправку записанных данных картинки AJAX-ом
         * получить JSON-ответ с сохраненными данными и вставить картинку в редактируемый текст
         */
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

        'a': function() {
            var selected = this.getSelectedHtml()[0];
            var tag = selected.tagName.toLowerCase();
            var text = this.getSelectedText();
            var button = this.getButton('a');
            var _this = this;
            // Добавление/редактирование ссылок
            switch (tag) {
                // Работаем с существующей ссылкой
                case 'a':
                    // Получим текст ссылки
                    if (!text) { text = selected.innerHTML; }
                    // Получим адрес и цель ссылки
                    var linkHref = selected.href;
                    var linkTarget = selected.target;
                    // Открываем и заполняем форму ссылки
                    this.showModal('link-form');
                    $('.mte_modal [name=name]').val(text);
                    $('.mte_modal [name=url]').val(linkHref);
                    $('.mte_modal [name=target]').val(linkTarget);
                    // "Вешаем" отправку формы
                    $('.mte_modal_submit').click(function () {
                        var nText = $('.mte_modal [name=name]').val();
                        var nHref = $('.mte_modal [name=url]').val();
                        var nTarget = $('.mte_modal [name=target]').val();
                        // Размещаем ссылку в тексте
                        _this.closeModal();
                        _this.restoreSelection();
                        $(selected).replaceWith('<a href="'+ nHref +'" target="'+ nTarget +'">'+ nText +'</a>');
                    });
                    // "Вешаем" удаление ссылки
                    $('.mte_modal_remove').click(function () {
                        _this.closeModal();
                        _this.restoreSelection();
                        $(selected).replaceWith(text);
                        button.removeClass('active');
                    });
                    break;
                // Создаем ссылку
                default:
                    // Проверим наличие текста ссылки
                    if (!text) { break; }
                    // Открываем и заполняем форму ссылки
                    this.showModal('link-form');
                    $('.mte_modal [name=name]').val(text);
                    // Вешаем "отправку" формы
                    $('.mte_modal_submit').click(function () {
                        var nText = $('.mte_modal [name=name]').val();
                        var nHref = $('.mte_modal [name=url]').val();
                        var nTarget = $('.mte_modal [name=target]').val();
                        // Размещаем ссылку в тексте
                        _this.closeModal();
                        _this.restoreSelection();
                        _this.insertHtml('<a href="'+ nHref +'" target="'+ nTarget +'">'+ nText +'</a>');
                        button.addClass('active');
                    });
                    // Ссылки еще нет - кнопка удалить не нужна
                    $('.mte_modal_remove').remove();
                    break;
            }
        },

        /**
         * BUG TODO: переименовать функцию в clearFormat и использовать для очистки форматирования не только пользователем, но и внутри компонента
         *
         * все теги, кроме описанных кнопками меню toolbarButtons должны удаляться
         * должна удалять все атрибуты из оставшихся в тексте тегов
         * должна форматировать код переносами после оставшихся в тексте закрывающих и непарных тегов
         * другие переносы должна обрабатывать: одиночный - заменить на br, более - на p
         * все спец-символы (кавычки, слеши, угловые скобки и т.п., но не угловые скобки тегов) должны быть заменены на HTML-сущности
         *
         * некорректно отрабатывает нажатие на Enter - сразу ставит p
         *  после первого нажатия ставить br
         *  после второго - менять br на p
         *  последующие - игнорировать
         *
         * оборачивает текст, следующий за br в <p>, в результате имеем <p><br><p></p></p>
         * добавляет br перед закрывающими тегами (например в заголовках или элементах списка)
         */
        'clearFormat': function () {
            console.log('Ooops, clearFormat called...', this);
            /*
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, '<p>');
            */
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
                <tr>\
                    <td>{{modal.target}}:</td>\
                    <td>\
                        <select name="target">\
                            <option value="_blank">{{modal.newwindow}}</option>\
                            <option value="_self">{{modal.selfwindow}}</option>\
                        </select>\
                    </td>\
                </tr>\
                <tr colspan="2">\
                    <td>\
                        <input type="button" value="{{modal.insert}}" class="mte_modal_submit" />\
                        <input type="button" value="{{modal.cancel}}" class="mte_modal_cancel" />\
                        <input type="button" value="{{modal.remove}}" class="mte_modal_remove" />\
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
            'toolbar.p': 'Paragraph',
            'toolbar.image': 'Image',
            'toolbar.link': 'Link',
            'toolbar.removeformat': 'Remove Format',

            'toolbar.html_mode': 'Switch to HTML Mode',
            'toolbar.visual_mode': 'Switch to Visual Mode',

            'modal.insert': 'Insert',
            'modal.cancel': 'Cancel',
            'modal.remove': 'Remove',
            'modal.insert_image': 'Image',
            'modal.insert_link': 'Link',
            'modal.image': 'Image',
            'modal.link': 'Link',
            'modal.target': 'Target',
            'modal.newwindow': 'New window',
            'modal.selfwindow': 'Self window',
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
            'toolbar.p': 'Параграф',
            'toolbar.image': 'Изображение',
            'toolbar.link': 'Ссылка',
            'toolbar.removeformat': 'Очистить форматирование',

            'toolbar.html_mode': 'Переключить в режим HTML',
            'toolbar.visual_mode': 'Переключить в визуальный режим',

            'modal.insert': 'Вставить',
            'modal.cancel': 'Отмена',
            'modal.remove': 'Удалить',
            'modal.insert_image': 'Вставка изображения',
            'modal.insert_link': 'Вставка ссылки',
            'modal.image': 'Изображение',
            'modal.link': 'Ссылка',
            'modal.target': 'Открывать в',
            'modal.newwindow': 'Новом окне',
            'modal.selfwindow': 'Текущем окне',
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

    /**
     * Тулбар
     */
    addPlugin: function(name, func){
        this.toolbarButtons.push(name);
        this.plugins[name] = func;
    },

    getToolbar: function () {
        return $('.mte_toolbar', this.$wrapper);
    },

    drawToolbar: function () {
        for (var i = 0; i < this.toolbarButtons.length; ++i){
            var name = this.toolbarButtons[i];
            switch (name) {
                // Вставляем разделитель
                case 'divider':
                    this.addToolbarDivider();
                    break;
                // Вставляем селект
                case 'textFormats':
                    var options = this.textFormats;
                    this.addTextFormats(options);
                    _this = this;

                    $('select[name="textFormat"]').change(function () {
                        selectedFormat = $(this).val();
                        console.log('textFormat changed on', selectedFormat);
                        _this.plugins[selectedFormat](_this);
                    });

                    break;
                // Вставляем кнопку
                default:
                    this.addToolbarButton(name);
                    this.getButton(name).click( $.proxy(this.plugins[name], this) );
            }
        }
    },

    addToolbarButton: function (name) {
        var btn = $('<li><a class="mte_toolbar_button mte_toolbar_button__' + name + '" href="#" title="' + this.translate('toolbar.'+name) + '"></a></li>');
        this.getToolbar().append(btn);
    },

    addToolbarDivider: function () {
        this.getToolbar().append(this.options.menuDivider);
    },

    addTextFormats: function (options) {
        var select = $('<select name="textFormat" class="mte_toolbar_select"></select>');
        for (var i = 0; i < options.length; ++i){
            var name = options[i];
            var option = name === 'divider' ? '<option disabled class="divider" value="divider">------------------</option>'
                : $('<option value="'+ name +'">'+ this.translate('toolbar.'+ name) +'</option>');
            select.append(option);
        }
        this.getToolbar().append(select);
    },

    getButton: function (name) {
        return $('.mte_toolbar_button__' + name, this.$wrapper);
    },

    insertHtml: function (html) {
        document.execCommand('InsertHtml', false, html);
    },

    /**
     * BUG TODO: look the clearFormat function description
     */
    htmlMode: function () {
        if (this.mode === 'html') {
            return;
        }
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
        newValue = value = this.$textarea.val();

        // Разбить текст по переносам строк
        parts = newValue.split(/\n/igm);
        newValue = '';
        for (var i = 0; i < parts.length; ++i) {
            // Получим строку из текста
            var str, strPrev, strNext;
            str = parts[i];
            // Проверим наличие и получим предыдущую и следующую строки
            if((i - 1) in parts) {
                strPrev = parts[i - 1];
            }
            if ((i + 1) in parts) {
                strNext = parts[i + 1];
            }

            // Запишем открывающий p
            /**
             * Если
             * предыдущая строка отстутствует
             * ИЛИ (в конце предыдущей строки есть закрывающий p|div|h\d|ul|ol
             * И в начале следующей нет открывающего тега p|div|h\d|ul|ol|li))
             * И в начале текущей строки нет открывающего тега p|div|h\d|ul|ol|li
             */
            if ((!strPrev
                || (strPrev.search(/\<\/(p|div|h\d|ul|ol|li)\>$/igm) >= 0
                    && strNext
                    && strNext.search(/^\s*\<(p|div.*|h\d|ul|ol|li)\>/igm) < 0
                ))
                && str.length > 0
                && str.search(/^\s*\<(p|div.*|h\d|ul|ol|li)\>|^\s*\<\/(p|div|h\d|ul|ol|li)\>/igm) < 0
            ) {
                str = '<p>'+ str;
            }

            // Запишем br
            /**
             * Если
             * в конце текущей нет закрывающих p|div|h\d|ul|ol|li ИЛИ br
             * И в начале следующей нет открывающих p|div|h\d|ul|ol|li
             */
            if (str.length > 0
                && str.search(/\<\/(p|div|h\d|ul|ol|li)\>$|\<br\>$/igm) < 0
                && strNext.length > 0
                && strNext.search(/^\s*\<(p|div.*|h\d|ul|ol|li)\>/igm) < 0
            ) {
                str = str +'<br>';
            }
            // Заменим варианты br
            str = str.replace(/\<br \/\>/igm, '<br>\n');

            // Запишем закрывающий p
            /**
             * Если
             * в конце текущей нет закрывающих ИЛИ открывающих p|div|h\d|ul|ol|li ИЛИ br
             */
            if (str.length > 0
                && str.search(/\<\/(p|div|h\d|ul|ol|li)\>$|\<(p|div.*|h\d|ul|ol|li)\>$|\<br\>$/igm) < 0
            ) {
                str = str +'</p>';
            }

            // Запишем перенос, ради читаемости текста
            str.length > 0 ? str = str +'\n':false;
            newValue = newValue + str;
        }

        value = newValue;
        this.$div.html(value);
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

    getSelected: function() {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
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

    /**
     * BUG TODO:
     * функции getSelectedHtml, saveSelection и restoreSelection неправильно работают с вложенными блоками в списках
     */
    getSelectedHtml: function() {
        var selection = window.getSelection();
        console.log('getSelectedHtml', selection);
        if( selection ) {
            var range = (document.all ? selection.createRange() : selection.getRangeAt(selection.rangeCount - 1).cloneRange());

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

    /**
     * BUG TODO: см. комментарий к функции getSelectedHtml
     */
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

    /**
     * BUG TODO: см. комментарий к функции getSelectedHtml
     */
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

    /**
     * BUG TODO: см. комментарий к функции getSelectedHtml
     */
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
