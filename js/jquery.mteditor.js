(function( $ ) {
    /**
     * WYSIWYG MTeditor plugin
     */
    $.fn.MTeditor = function(options) {
        console.log('\n\nPlugin MTeditor is starting');

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
        console.log('Plugin MTeditor is started with options', options);

        /*
         * Plugin functions
         */
        var draw = function(block) {
            console.log('\nRe-draw block', block);

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
            console.log('block', block);
        });
    };

})(jQuery);
