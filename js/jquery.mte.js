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
    this.default_file_uploader = '/mte/upload-image.php';
    this.default_image_list = '/mte/image-list.php';
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
    this.options.uploaderUrl = this.options.uploaderUrl || this.default_file_uploader;
    this.options.imageList = this.options.imageList || this.default_image_list;
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

    /*
     * Bind the reaction on selection events
     */
    this.$div.bind('keyup click', function (e) {
        console.log('\n=====================\nFocus on element');
        // Элементы интерфейса
        var menuButtons = _this.getToolbar().find('.mte_toolbar_button');
        var textFormatOptions = _this.getToolbar().find('.mte_toolbar_select[name="textFormat"]');

        var $nodes = _this.getSelectedHtml();
        console.log('Catch selection-event on '+ $nodes.length +' elements');
        console.log('Selected elements', $nodes);

        // Если элементов множество
        if ($nodes.length > 1) {
            console.log('элементов множество', $nodes);
            //var $node = $(_this.getSelectionStartNode());
        // Если элемет один
        } else {
            var $node = $($nodes[0]);
            var tag = $nodes[0].tagName.toLowerCase();
            var button = _this.getButton(tag);
            // Выделить кнопку
            switch (tag) {
                case 'b':       // Жирный
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    if ($node.closest('i').length) { _this.getButton('i').addClass('active'); }
                    if ($node.closest('strike').length) { _this.getButton('strike').addClass('active'); }
                    if ($node.closest('u').length) { _this.getButton('u').addClass('active'); }
                    if ($node.closest('a').length) { _this.getButton('a').addClass('active'); }
                    if ($node.closest('.tooltip').length) { _this.getButton('tooltip').addClass('active'); }
                    textFormatOptions.val('p');
                    break;
                case 'i':       // Курсив
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    if ($node.closest('b').length) { _this.getButton('b').addClass('active'); }
                    if ($node.closest('strike').length) { _this.getButton('strike').addClass('active'); }
                    if ($node.closest('u').length) { _this.getButton('u').addClass('active'); }
                    if ($node.closest('a').length) { _this.getButton('a').addClass('active'); }
                    if ($node.closest('.tooltip').length) { _this.getButton('tooltip').addClass('active'); }
                    textFormatOptions.val('p');
                    break;
                case 'strike':  // Зачеркнуто
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    if ($node.closest('b').length) { _this.getButton('b').addClass('active'); }
                    if ($node.closest('i').length) { _this.getButton('i').addClass('active'); }
                    if ($node.closest('u').length) { _this.getButton('u').addClass('active'); }
                    if ($node.closest('a').length) { _this.getButton('a').addClass('active'); }
                    if ($node.closest('.tooltip').length) { _this.getButton('tooltip').addClass('active'); }
                    textFormatOptions.val('p');
                    break;
                case 'u':       // Подчеркнуто
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    if ($node.closest('b').length) { _this.getButton('b').addClass('active'); }
                    if ($node.closest('i').length) { _this.getButton('i').addClass('active'); }
                    if ($node.closest('strike').length) { _this.getButton('strike').addClass('active'); }
                    if ($node.closest('a').length) { _this.getButton('a').addClass('active'); }
                    if ($node.closest('.tooltip').length) { _this.getButton('tooltip').addClass('active'); }
                    textFormatOptions.val('p');
                    break;
                case 'h1':      // Заголовок 1
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h2':      // Заголовок 2
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h3':      // Заголовок 3
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h4':      // Заголовок 4
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h5':      // Заголовок 5
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'h6':      // Заголовок 6
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break;
                case 'p':       // Абзац
                    menuButtons.removeClass('active');
                    textFormatOptions.val(tag);
                    break
                case 'a':       // Ссылка
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('p');
                    break;
                case 'div':     // Картинка
                    if ($node.hasClass('image')
                        || $node.hasClass('image_wrap')
                        || $node.hasClass('image_img')
                        || $node.hasClass('image_title')
                        || $node.hasClass('image_alt')
                    ) {
                        menuButtons.removeClass('active');
                        button = _this.getButton('image');
                        button.addClass('active');
                    }
                    break;
                case 'span':    // Подсказка
                    if ($node.hasClass('tooltip')
                        || $node.hasClass('tooltip_balloon')
                        || $node.hasClass('tooltip_title')
                        || $node.hasClass('tooltip_hint')
                    ) {
                        menuButtons.removeClass('active');
                        button = _this.getButton('tooltip');
                        button.addClass('active');
                    }
                    break;
                case 'li':      // Списки
                    var parentTag = $node.parent()[0].tagName.toLowerCase();
                    button = _this.getButton(parentTag);
                    menuButtons.removeClass('active');
                    button.addClass('active');
                    textFormatOptions.val('divider');
                    break;
            }
        }
        console.log('=====================\n');
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
        'a','image','tooltip','divider',
        /**
         * TODO: look the clearFormat function description
         */
        'removeformat'
    ],

    /**
     * TODO: см комментарий к toolbarButtons
     */
    plugins: {
        /*
         * Выделение текста
         */
        'b': function () {
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

        /*
         * Списки
         */
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

        /*
         * Форматы текста
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
        // Очистка форматирования
        'removeformat': function () {
            var selected = this.getSelectedHtml();
            for (var i = 0; i < selected.length; ++i) {
                var tag = selected[i].tagName.toLowerCase();
                if (tag === 'p' || tag.search(/h\d/i) >= 0) {
                    var paragraph = $(selected[i]);
                } else if (tag === 'b' || tag === 'i' || tag === 'strike' || tag === 'u') {
                    var paragraph = $(selected[i]).closest('p');
                }
                var parAttrs = paragraph[0].attributes;
                for (var j = 0; j < parAttrs.length; ++j) {
                    paragraph.removeAttr(parAttrs[j].nodeName);
                }
            }
            document.execCommand('RemoveFormat', false, true);
            this.$div.focus();
            return false;
        },

        /*
         * Работа с картинками
         */
        'image': function() {
            var selected = this.getSelectedHtml()[0];
            var tag = selected.tagName.toLowerCase();
            var button = this.getButton('image');
            var _this = this;

            // Добавление/редактирование картинок
            switch (tag) {
                // Работаем с существующей картинкой
                case 'div':
                    // Обрабатываем клики только по блокам картинок
                    if ($(selected).hasClass('image')
                        || $(selected).hasClass('image_wrap')
                        || $(selected).hasClass('image_img')
                        || $(selected).hasClass('image_title')
                        || $(selected).hasClass('image_alt')
                    ) {
                        // Если выбран не "верхний" див блока, то выберем его
                        if (!$(selected).hasClass('image')) {
                            selected = $(selected).closest('.image');
                        }
                        // Получим данные картинки
                        var selectedImage = selected.find('img')[0];
                        // Покажем и заполним форму
                        this.showModal('image-form');
                        $('.mte_modal [name=url]').val(selectedImage.src);
                        $('.mte_modal [name=title]').val(selectedImage.title);
                        $('.mte_modal [name=alt]').val(selectedImage.alt);
                        $('.mte_modal [name=float]').val(selectedImage.className);
                        $('.mte_modal [name=width]').val(selectedImage.width);
                        $('.mte_modal [name=height]').val(selectedImage.height);

                        // Вешаем выбор картинки
                        $('.mte_modal_choose_image').click(function () {
                            var tblCol = $(this).parent();
                            // Запросим AJAX-ом JSON с данными имеющихся на сервере картинок
                            $.ajax({
                                url: _this.options.imageList,
                                dataType: 'json',
                                // Принимаем ответ и отрисовываем блок
                                success:  function (response) {
                                    // Перезагрузка блока
                                    if (tblCol.find('.image_list').length) {
                                        tblCol.find('.image_list').remove();
                                        tblCol.find('.image_list_close').remove();
                                    }
                                    // Добавим в конец колонки блок для списка картинок
                                    var imgListBlock = $('<div class="image_list"></div>');
                                    tblCol.append(imgListBlock);
                                    // Добавим картинки в список
                                    for (var i = 0; i < response.length; ++i) {
                                        var imgBlock = $('<div class="img" id="'+ response[i].id +'">'
                                            +'<img src="'+ response[i].path +'" title="'+ response[i].title +'" alt="'+ response[i].alt +'" />'
                                            +'<div class="title">Title: '+ response[i].title +'</div>'
                                            +'<div class="alt">Comment: '+ response[i].alt +'</div>'
                                            +'</div>');
                                        imgListBlock.append(imgBlock);
                                    }
                                    // Получим и ограничим ширину для блока списка картинок
                                    var blWidth = tblCol.width();
                                    imgListBlock.width(blWidth);
                                    // Добавим кнопку закрытия блока списка картинок
                                    var imgListClose = $('<div class="image_list_close"></div>').width(blWidth);
                                    var imgListCloseButton = $('<input type="button" value="'+ _this.translate('modal.cancel') + '" class="mte_modal_close_image_list" />');
                                    tblCol.append(imgListClose.append(imgListCloseButton));
                                    // Покажем список картинок
                                    imgListBlock.slideDown();
                                    imgListClose.slideDown();

                                    // "Вешаем" закрытие списка картинок
                                    imgListCloseButton.click(function () {
                                        imgListBlock.slideUp();
                                        imgListClose.slideUp();
                                    });

                                    // "Вешаем" выбор картинки
                                    imgListBlock.find('.img').click(function () {
                                        var imgId = $(this).attr('id');
                                        var img = $(this).children();
                                        var imgSrc = img.attr('src');
                                        var imgTitle = img.attr('title');
                                        var imgAlt = img.attr('alt');
                                        // Запишем значения в форму добавления картинки
                                        $('.mte_modal [name=url]').val(imgSrc);
                                        $('.mte_modal [name=title]').val(imgTitle);
                                        $('.mte_modal [name=alt]').val(imgAlt);
                                        // Закроем блок списка картинок
                                        imgListBlock.slideUp();
                                        imgListClose.slideUp();
                                    });
                                },
                                // Ошибка загрузки JSQON
                                error: function (response) {
                                    //_this.closeModal();
                                    //_this.restoreSelection();
                                    console.log('error response', response);
                                    //alert('Ошибка!\nФайл не загружен');
                                }
                            });
                        });

                        // "Вешаем" отправку формы
                        $('.mte_modal_submit').click(function () {
                            var newImage = {
                                'url':$('.mte_modal [name=url]').val(),
                                'title':$('.mte_modal [name=title]').val(),
                                'alt':$('.mte_modal [name=alt]').val(),
                                'float':$('.mte_modal [name=float]').val(),
                                'width':$('.mte_modal [name=width]').val(),
                                'height':$('.mte_modal [name=height]').val()
                            }
                            newImage = _this.genImage(newImage);
                            // Вставляем картинку
                            _this.closeModal();
                            //_this.restoreSelection();
                            $(selected).replaceWith(newImage);
                            button.removeClass('active');
                        });
                        // "Вешаем" удаление картинки
                        $('.mte_modal_remove').click(function () {
                            _this.closeModal();
                            _this.restoreSelection();
                            $(selected).remove();
                            button.removeClass('active');
                        });
                    }
                    break;
                // Создаем картинку
                default:
                    // Определим перед каким блоком вставлять картинку
                    if (tag !== 'p') {
                        selected = $(selected).closest('p');
                    } else {
                        selected = $(selected);
                    }
                    // Покажем форму
                    this.showModal('image-form');

                    // Вешаем выбор картинки
                    $('.mte_modal_choose_image').click(function () {
                        var tblCol = $(this).parent();
                        // Запросим AJAX-ом JSON с данными имеющихся на сервере картинок
                        $.ajax({
                            url: _this.options.imageList,
                            dataType: 'json',
                            // Принимаем ответ и отрисовываем блок
                            success:  function (response) {
                                // Перезагрузка блока
                                if (tblCol.find('.image_list').length) {
                                    tblCol.find('.image_list').remove();
                                    tblCol.find('.image_list_close').remove();
                                }
                                // Добавим в конец колонки блок для списка картинок
                                var imgListBlock = $('<div class="image_list"></div>');
                                tblCol.append(imgListBlock);
                                // Добавим картинки в список
                                for (var i = 0; i < response.length; ++i) {
                                    var imgBlock = $('<div class="img" id="'+ response[i].id +'">'
                                        +'<img src="'+ response[i].path +'" title="'+ response[i].title +'" alt="'+ response[i].alt +'" />'
                                        +'<div class="title">Title: '+ response[i].title +'</div>'
                                        +'<div class="alt">Comment: '+ response[i].alt +'</div>'
                                        +'</div>');
                                    imgListBlock.append(imgBlock);
                                }
                                // Получим и ограничим ширину для блока списка картинок
                                var blWidth = tblCol.width();
                                imgListBlock.width(blWidth);
                                // Добавим кнопку закрытия блока списка картинок
                                var imgListClose = $('<div class="image_list_close"></div>').width(blWidth);
                                var imgListCloseButton = $('<input type="button" value="'+ _this.translate('modal.cancel') + '" class="mte_modal_close_image_list" />');
                                tblCol.append(imgListClose.append(imgListCloseButton));
                                // Покажем список картинок
                                imgListBlock.slideDown();
                                imgListClose.slideDown();

                                // "Вешаем" закрытие списка картинок
                                imgListCloseButton.click(function () {
                                    imgListBlock.slideUp();
                                    imgListClose.slideUp();
                                });

                                // "Вешаем" выбор картинки
                                imgListBlock.find('.img').click(function () {
                                    var imgId = $(this).attr('id');
                                    var img = $(this).children();
                                    var imgSrc = img.attr('src');
                                    var imgTitle = img.attr('title');
                                    var imgAlt = img.attr('alt');
                                    // Запишем значения в форму добавления картинки
                                    $('.mte_modal [name=url]').val(imgSrc);
                                    $('.mte_modal [name=title]').val(imgTitle);
                                    $('.mte_modal [name=alt]').val(imgAlt);
                                    // Закроем блок списка картинок
                                    imgListBlock.slideUp();
                                    imgListClose.slideUp();
                                });
                            },
                            // Ошибка загрузки JSQON
                            error: function (response) {
                                //_this.closeModal();
                                //_this.restoreSelection();
                                console.log('error response', response);
                                //alert('Ошибка!\nФайл не загружен');
                            }
                        });
                    });

                    // "Вешаем" AJAX-запрос на отправку формы
                    $('.mte_modal_submit').click(function () {
                        var formData = new FormData($('form')[0]);
                        $.ajax({
                            url: _this.options.uploaderUrl,
                            type: 'POST',
                            // XMLHttpRequest
                            xhr: function() {
                                var myXhr = $.ajaxSettings.xhr();
                                return myXhr;
                            },
                            data: formData,
                            dataType: "json",
                            cache: false,
                            contentType: false,
                            processData: false,
                            //beforeSend: beforeSendHandler,
                            // Принимаем ответ и отрисовываем блок картинки
                            success: function (response) {
                                _this.closeModal();
                                _this.restoreSelection();
                                selected.before(_this.genImage(response));
                                button.addClass('active');
                            },
                            // Ошибка загрузки файла
                            error: function (response) {
                                _this.closeModal();
                                _this.restoreSelection();
                                console.log('response', response);
                                alert('Ошибка!\nФайл не загружен');
                            }
                        });
                    });

                    // Картинки еще нет - кнопка удалить не нужна
                    $('.mte_modal_remove').remove();
                    break;
            }
            return false;
        },

        /*
         * Работа со ссылками
         */
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
            return false;
        },

        /*
         * Работа с подсказками
         */
        'tooltip': function () {
            var selected = this.getSelectedHtml()[0];
            var tag = selected.tagName.toLowerCase();
            var text = this.getSelectedText();
            var button = this.getButton('tooltip');
            var _this = this;
            // Добавление/редактирование подсказок
            switch (tag) {
                // Работаем с существующей подсказкой
                case 'span':
                    var cloned = $(selected).clone()[0];
                    // Получим содержимое дочерних элементов title и text
                    var tooltipTitle = $(cloned).find('.tooltip_title').remove()[0].innerHTML;
                    var tooltipText = $(cloned).find('.tooltip_hint').remove()[0].innerHTML;
                    // Удалим обертку
                    $(cloned).find('.tooltip_balloon').remove();
                    // Получим текст ссылки
                    if (!text) { text = cloned.innerHTML; }
                    // Открываем и заполняем форму ссылки
                    this.showModal('tooltip-form');
                    $('.mte_modal [name=name]').val(text);
                    $('.mte_modal [name=title]').val(tooltipTitle);
                    $('.mte_modal [name=hint]').val(tooltipText);
                    // "Вешаем" отправку формы
                    $('.mte_modal_submit').click(function () {
                        var newTooltip = {
                            'text':$('.mte_modal [name=name]').val(),
                            'title':$('.mte_modal [name=title]').val(),
                            'tooltip':$('.mte_modal [name=hint]').val()
                        }
                        newTooltip = _this.genTooltip(newTooltip);
                        // Размещаем блок в тексте
                        _this.closeModal();
                        _this.restoreSelection();
                        $(selected).replaceWith(newTooltip);
                    });
                    // "Вешаем" удаление подсказки
                    $('.mte_modal_remove').click(function () {
                        _this.closeModal();
                        _this.restoreSelection();
                        $(selected).replaceWith(text);
                        button.removeClass('active');
                    });
                    break;
                // Создаем подсказку
                default:
                    // Проверим наличие текста ссылки
                    if (!text) { break; }
                    // Открываем и заполняем форму ссылки
                    this.showModal('tooltip-form');
                    $('.mte_modal [name=name]').val(text);
                    // Вешаем "отправку" формы
                    $('.mte_modal_submit').click(function () {
                        var newTooltip = {
                            'text':$('.mte_modal [name=name]').val(),
                            'title':$('.mte_modal [name=title]').val(),
                            'tooltip':$('.mte_modal [name=hint]').val()
                        }
                        newTooltip = _this.genTooltip(newTooltip);
                        // Размещаем ссылку в тексте
                        _this.closeModal();
                        _this.restoreSelection();
                        _this.insertHtml(newTooltip);
                        button.addClass('active');
                    });
                    // Ссылки еще нет - кнопка удалить не нужна
                    $('.mte_modal_remove').remove();
                    break;
            }
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
            <form class="mte_modal_img_form" action="{{UPLOADER_URL}}" method="POST" enctype="multipart/form-data" >\
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
                        <td>\
                            <input type="text" name="url" size="30" value="" />\
                            <input type="button" value="{{modal.choose_image}}" class="mte_modal_choose_image" />\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>{{modal.title}}:</td>\
                        <td><input type="text" name="title" size="40" value="" /></td>\
                    </tr>\
                    <tr>\
                        <td>{{modal.alt}}:</td>\
                        <td><textarea name="alt" cols="39" rows="4" style="resize: none;"></textarea></td>\
                    </tr>\
                    <tr>\
                        <td>{{modal.floating}}:</td>\
                        <td>\
                            <select name="float">\
                                <option value="left">{{modal.float_left}}</option>\
                                <option value="center">{{modal.float_center}}</option>\
                                <option value="right">{{modal.float_right}}</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>{{modal.dimensions}}:</td>\
                        <td>\
                            <input type="text" name="width" title="{{modal.width}}" size="4" value="" />px\
                            <span class="dim_div"></span>\
                            <input type="text" name="height" title="{{modal.height}}" size="4" value="" />px\
                        </td>\
                    </tr>\
                    <tr colspan="2">\
                        <td>\
                            <input type="button" value="{{modal.insert}}" class="mte_modal_submit" />\
                            <input type="button" value="{{modal.cancel}}" class="mte_modal_cancel" />\
                            <input type="button" value="{{modal.remove}}" class="mte_modal_remove" />\
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
                    <td><input type="text" name="url" size="30" value="http://" /></td>\
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
            </table>',

        'tooltip-form': '<h1>{{modal.insert_tooltip}}</h1>\
            <table>\
                <tr>\
                    <td>{{modal.name}}:</td>\
                    <td><input type="text" name="name" size="40" value="" /></td>\
                </tr>\
                <tr>\
                    <td>{{modal.title}}:</td>\
                    <td><input type="text" name="title" size="40" value="" /></td>\
                </tr>\
                <tr>\
                    <td>{{modal.hint}}:</td>\
                    <td><textarea name="hint" cols="39" rows="4" style="resize: none;"></textarea></td>\
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
            'toolbar.b': 'Bold',
            'toolbar.i': 'Italic',
            'toolbar.strike': 'Strike',
            'toolbar.u': 'Underline',
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
            'toolbar.a': 'Link',
            'toolbar.tooltip': 'Tooltip',
            'toolbar.removeformat': 'Remove Format',

            'toolbar.html_mode': 'Switch to HTML Mode',
            'toolbar.visual_mode': 'Switch to Visual Mode',

            'modal.insert': 'Insert',
            'modal.cancel': 'Cancel',
            'modal.remove': 'Remove',
            'modal.insert_image': 'Image',
            'modal.insert_link': 'Link',
            'modal.insert_tooltip': 'Tooltip',
            'modal.image': 'Image',
            'modal.link': 'Link',
            'modal.choose_image': 'Choose',
            'modal.title': 'Title',
            'modal.hint': 'Text',
            'modal.alt': 'Alt',
            'modal.floating': 'Float',
            'modal.float_left': 'Left',
            'modal.float_center': 'Center',
            'modal.float_right': 'Right',
            'modal.dimensions': 'Dimensions',
            'modal.width': 'Width',
            'modal.height': 'Height',
            'modal.target': 'Target',
            'modal.newwindow': 'New window',
            'modal.selfwindow': 'Self window',
            'modal.or': 'or',
            'modal.name': 'Name',
            'modal.html_code': 'HTML code'
        },
        'ru':{
            'toolbar.b': 'Жирный',
            'toolbar.i': 'Курсив',
            'toolbar.strike': 'Зачеркнутый',
            'toolbar.u': 'Подчеркивание',
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
            'toolbar.a': 'Ссылка',
            'toolbar.tooltip': 'Подсказка',
            'toolbar.removeformat': 'Очистить форматирование',

            'toolbar.html_mode': 'Переключить в режим HTML',
            'toolbar.visual_mode': 'Переключить в визуальный режим',

            'modal.insert': 'Вставить',
            'modal.cancel': 'Отмена',
            'modal.remove': 'Удалить',
            'modal.insert_image': 'Изображение',
            'modal.insert_link': 'Ссылка',
            'modal.insert_tooltip': 'Подсказка',
            'modal.image': 'Изображение',
            'modal.link': 'Ссылка',
            'modal.choose_image': 'Выбрать',
            'modal.title': 'Заголовок',
            'modal.hint': 'Текст',
            'modal.alt': 'Подпись',
            'modal.floating': 'Выравнивание',
            'modal.float_left': 'Слева',
            'modal.float_center': 'По-центру',
            'modal.float_right': 'Справа',
            'modal.dimensions': 'Размеры',
            'modal.width': 'Ширина',
            'modal.height': 'Высота',
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

    genImage: function (img) {
        var nImage = '<div class="image '+ img.float +'" contenteditable="false">\n\t'
            +'<div class="image_wrap"';
        if (img.width !== '') {
            nImage += ' style="width:'+ (parseInt(img.width) + 6) +'px;"';
        }
        nImage += '>\n\t\t'
            +'<div class="image_img">'
            +'<img src="'+ img.url +'" class="'+ img.float +'"';
        if (img.title !== '') {
            nImage += ' title="'+ img.title +'"'
        }
        if (img.alt !== '') {
            nImage += ' alt="'+ img.alt +'"'
        }
        if (img.width !== '') {
            nImage += ' width="'+ img.width +'"'
        }
        if (img.height !== '') {
            nImage += ' height="'+ img.height +'"'
        }
        nImage += '></div>\n\t';
        if (img.title !== '') {
            nImage += '<div class="image_title">'+ img.title +'</div>\n\t';
        }
        if (img.alt !== '') {
            nImage += '<div class="image_alt">'+ img.alt +'</div>\n\t';
        }
        nImage += '</div>\n</div>\n';
        return nImage;
    },

    genTooltip: function (tooltip) {
        var nTooltip = '<span class="tooltip">'+ tooltip.text +'<span class="tooltip_balloon">'
            +'<span class="tooltip_title">'+ tooltip.title +'</span><span class="tooltip_hint">'+ tooltip.tooltip +'</span>\n'  // Без переноса в конце этой строки - не работает
            +'</span></span>';
        return nTooltip;
    },

    /*
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
                || (strPrev.search(/\<\/(p|div|span|h\d|ul|ol|li)\>$/igm) >= 0
                    && strNext
                    && strNext.search(/^\s*\<(p.*|div.*|span.*|h\d|ul|ol|li)\>/igm) < 0
                ))
                && str.length > 0
                && str.search(/^\s*\<(p.*|div.*|span.*|h\d|ul|ol|li)\>|^\s*\<\/(p|div|span|h\d|ul|ol|li)\>/igm) < 0
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
                && str.search(/\<\/(p|div|span|h\d|ul|ol|li)\>$|\<br\>$/igm) < 0
                && strNext.length > 0
                && strNext.search(/^\s*\<(p.*|div.*|span.*|h\d|ul|ol|li)\>/igm) < 0
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
                && str.search(/\<\/(p|div|span|h\d|ul|ol|li)\>$|\<(p.*|div.*|span.*|h\d|ul|ol|li)\>$|\<br\>$/igm) < 0
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
