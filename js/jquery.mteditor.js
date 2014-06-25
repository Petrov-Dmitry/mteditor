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


    //this.templates['image-form'] = this.templates['image-form'].replace('{{UPLOADER_URL}}', this.options.uploaderUrl);
    // AJAX image uploading
}

mte.prototype = {
    toolbarButtons: [
        'bold',
        'italic',
        'strike',
        'underline',
        'ol',
        'ul',
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
        },'ol': function () {
            document.execCommand('InsertOrderedList', false, true);
            this.$div.focus();
            return false;
        },
        'ul': function () {
            document.execCommand('InsertUnorderedList', false, true);
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
        this.$textarea.val(this.$div.html());
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

/*
 * =========================================================
 */
(function( $ ) {
    /**
     * WYSIWYG MTeditor plugin
     */
    $.fn.MTeditor = function(options) {
        //console.log('\n\nPlugin MTeditor is starting');

        /*
         * MTeditor fuctions menu
         */
        fnMenu = {
            editorMode:{
                html:'Visual',
                raw:'Source'
            },
            textTypes:{
                headers:{
                    plain:'Plain text',
                    h1:'Header 1',
                    h2:'Header 2',
                    h3:'Header 3',
                    h4:'Header 4',
                    h5:'Header 5',
                    h6:'Header 6'
                },
                paragrapth:'Paragraph'
            },
            textHighlighting:{
                bold:'Bold',
                italic:'Italic',
                strike:'Strikeout',
                underlined:'Underlined'
            },
            lists:{
                ul:'Marked',
                ol:'Numbered',
                levelUp:'Level up',
                levelDown:'Level down'
            },
            tables:{
                table:'Table',
                tableCols:'Collumns',
                tableRows:'Rows'
            },
            others:{
                link:'Insert link',
                image:'Insert image'
            },
            clear:{
                clear:'Clear formatting'
            }
        };
        //console.log('MTeditor function-buttons', fnMenu);

        /*
         * Plugin HTML-codes
         */
        var wrapper = '<div class="mteditor"></div>',
            menuWrapper = '<div class="menu"></div>',
            menuGroup = '<div class="group"></div>',
            menuSel = '<select></select>',
            menuSelOption = '<option></option>',
            menuButton = '<div class="button"></div>',
            content = '<div class="content"></div>';
        //console.log('MTeditor wrapper block', wrapper);
        //console.log('MTeditor menuWrapper block', menuWrapper);
        //console.log('MTeditor menuButton block', menuButton);
        //console.log('MTeditor content block', content);

        /*
         * Plugin options
         */
        options = $.extend({
            debug : 0, //set to 1 to expose the values received by the flash file
            uplBgColor: "FFFFDF",
            uplBarColor: "FFDD00",
            allowedExt: "*.avi; *.jpg; *.jpeg; *.png",
            validFileMessage: 'Thanks, now hit Upload!',
            endMessage: 'and don\'t you come back ;)',
            activeMode: 'html',
            menuDivider: '<span class="divider"></span>',
            resizable: false
        }, options);
        //console.log('Plugin MTeditor is started with options', options);

        /*
         * Plugin functions
         */
        var draw = function(block) {
            //console.log('\nRe-draw block', block);

            var $block = $(block),
                blockId = $block.attr('id'),
                divider = options.menuDivider
                text = $block.html();
            //console.log('blockId', blockId);
            //console.log('Menu buttons', fnMenu);
            //console.log('Menu divider', divider);
            //console.log('Editable text', text);

            // Make the MTeditor-block
            wrapper = $(wrapper).attr('id', blockId);
            //console.log('wrapper', wrapper);
            if (options.resizable === true) {
                wrapper.addClass('resizable').resizable();
            }

            // Build the MTeditor menu
            var i = 0,
                menu = $(menuWrapper);
            $.each(fnMenu, function(index, buttons) {
                //console.log(index, buttons);
                // Create group
                if (index !== 'editorMode') {
                    group = $(menuGroup).attr('id', index);
                    $.each(buttons, function(key, value) {
                        //console.log('Button', key, value);
                        // Create buttons
                        if (key !== 'headers') {
                            button = $(menuButton).html(value).attr('id', key).attr('title', value);
                            //console.log('Button ready', button);
                            // Insert button into the group
                            group.append(button);
                        // Create heders select
                        } else {
                            select = $(menuSel).attr('name', key);
                            //console.log('heders select', select);
                            $.each(value, function(opt, val) {
                                //console.log('Option', opt, val);
                                button = $(menuSelOption).attr('id', opt).val(opt).html(val);
                                // Insert option into the select
                                select.append(button);
                            });
                            // Insert select into the group
                            group.append(select);
                        }
                    });
                    //console.log('Group ready', group);
                // editorMode group
                } else {
                    group = $(menuGroup).attr('id', index);
                    select = $(menuSel).attr('name', index);
                    // Create select
                    $.each(buttons, function(key, value) {
                        //console.log('Button', key, value);
                        button = $(menuSelOption).attr('id', key).val(key).html(value);
                        //console.log('Button ready', button);
                        // Insert option into the select
                        select.append(button);
                        // Make selection
                        if (options.activeMode == key) {
                            //button.attr('selected', true);
                            select.val(key);
                        }
                        // Insert select into the group
                        group.append(select);
                    });
                }
                //console.log(group);
                // Insert group into the menu
                if (i > 0) {
                    menu.append(divider);
                }
                menu.append(group);
                i++;
            });
            //console.log('menu', menu);

            // Add the menu and content-block into MTeditor
            wrapper.append(menu).append($(content).attr('contentEditable', true).html(text));

            // Hide TEXTAREA and draw MTeditor-block
            $block.hide().before(wrapper);

            return wrapper;
        }

        /*
         * Plugin proceed
         */
        return this.each(function() {
            //console.log('Founded block', this);
            var $this = $(this);
            //console.log('$this', $this);
            block = draw(this);
            blockId = block.attr('id');
            text = block.find('.content').html();
            //console.log('block ' + blockId, block);
            //console.log('text', text);

            // MTeditor menu items
            buttons = block.find('.button');
            selectMode = block.find('select[name="editorMode"]');
            selectText = block.find('select[name="headers"]');
            //console.log('buttons', buttons);
            //console.log('selectMode', selectMode);
            //console.log('selectText', selectText);

            // Catch the clicks on buttons
            buttons.click(function() {
                //console.log('Button click detected', this);
                method = $(this).attr('id');
                //console.log('Calling method ' + method);
                editor = $(this).closest('.mteditor');
                editorId = editor.attr('id');
                //console.log('Parent editor-block is '+ editorId, editor);
            });

            // Catch the changing selectMode
            selectMode.change(function() {
                //console.log('selectMode change detected', this);
                method = $(this).val();
                //console.log('Change editor mode to: ' + method);
                editor = $(this).closest('.mteditor');
                editorId = editor.attr('id');
                //console.log('Parent editor-block is '+ editorId, editor);
            });

            // Catch the changing selectText
            selectText.change(function() {
                //console.log('selectText change detected', this);
                method = $(this).val();
                //console.log('Change text to: ' + method);
                editor = $(this).closest('.mteditor');
                editorId = editor.attr('id');
                //console.log('Parent editor-block is '+ editorId, editor);
            });
        });
    };

})(jQuery);
