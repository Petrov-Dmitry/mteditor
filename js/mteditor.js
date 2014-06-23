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
            }
        };
        //console.log('MTeditor function-buttons', fnMenu);

        /*
         * Plugin HTML-codes
         */
        var wrapper = '<div class="mteditor"></div>',
            menuWrapper = '<div class="menu"></div>',
            menuGroup = '<div class="group"></div>',
            menuMode = '<select name="activeMode"></select>',
            menuModeOption = '<option value=""></option>',
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
            console.log('Proceeding block', block);

            var blockId = block.attr('id'),
                divider = options.menuDivider;
            console.log('blockId', blockId);
            console.log('Menu buttons', fnMenu);
            console.log('Menu divider', divider);
        }

        /*
         * Plugin proceed
         */
        return this.each(function() {
            //console.log('Founded block', this);
            var $this = $(this);
            //console.log('$this', $this);
            draw($this);
        });
    };

})(jQuery);
