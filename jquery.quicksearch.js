(function( $ ) {
    var methods = {
        init : function( options ) {
            // Defaults
            var settings = $.extend({
                ajax: {},
                container : null,
                containerTag: 'ul',
                format: $.fn.quickSearch.format,
                preventSubmit: true,
                resultTag: 'li',
                timeout : 500,
                url : document.location.href
            }, options);
            
            return this.each(function(){
                var $this = $(this),
                data = $this.data('quickSearch');
                    
                // Initialization
                if ( ! data ) {
                    var container;
                    
                    // Results container
                    if (settings.container === null) {
                        container = $('<' + settings.containerTag + ' />');
                        $this.after(container);
                    } else {
                        container = $(settings.container);
                    }
                    
                    // Data
                    $(this).data('quickSearch', {
                        target : $this,
                        ajax: settings.ajax,
                        container: {
                            element: container,
                            generated: settings.container === null,
                            resultTag: settings.resultTag
                        },
                        format: settings.format,
                        terms: $this.val(),
                        timeout: {
                            delay: settings.timeout,
                            id: null
                        },
                        url: settings.url
                    });
                    
                    // CSS classes
                    $this.addClass('quicksearch-input');
                    container.addClass('quicksearch-results');

                    // Handle inputs
                    $this.on('keydown keyup', function(event) {
                        if(event.type == 'keydown') {
                            window.clearTimeout($(event.target).data('quickSearch').timeout.id);
                        } else if (event.type == 'keyup') {
                            $this.quickSearch('trigger');
                        }
                    });
                    
                    // Prevent form from submitting
                    if(settings.preventSubmit) $this.parents('form').on('submit', false);
                }

                data.target.triggerHandler('initialized.quickSearch');
            });
        },
        destroy : function( ) {
            return this.each(function(){
                var data = $(this).data('quickSearch');
                
                data.target.removeClass('quicksearch-input');
                data.container.element.removeClass('quicksearch-results');
                
                if (data.container.generated) data.container.element.remove();
                
                data.target.removeData('quickSearch');
            });
        },
        trigger : function( ) {
            return this.each(function(){
                var data = $(this).data('quickSearch'),
                terms = $.trim(data.target.val());
                
                // Call search() when terms changed after specified timeout
                if(terms != data.terms) {
                    window.clearTimeout(data.timeout.id);
                    data.terms = terms;
                    
                    data.timeout.id = window.setTimeout(function(){
                        data.target.quickSearch('search');
                    }, data.timeout.delay);
                }
                
            });
        },
        search : function( ) { 
            return this.each(function(){
                var data = $(this).data('quickSearch');
                    
                if (data.terms.length == 0) {
                    data.target.quickSearch('clear');
                } else {
                    $.ajax($.extend(data.ajax, {
                        accepts: 'application/json',
                        data: {
                            terms: data.terms
                            },
                        dataType: 'json',
                        url : data.url,
                        beforeSend: function() {
                            data.target.addClass('loading');
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            data.target.quickSearch('clear')
                                .quickSearch('showError', errorThrown.message);
                        },
                        success: function( results ) {
                            if(! $.isArray(results)) {
                                $.error('jQuery.quickSearch: results data must be an array !');
                            } else {
                                data.target.quickSearch('clear')
                                    .quickSearch('showResults', results);
                            }
                        },
                        complete: function() {
                            data.target.removeClass('loading');
                        }
                    }));
                }

            });
        },
        showError: function ( message ) {
            return this.each(function(){
                var data = $(this).data('quickSearch');

                // Error event
                data.target.triggerHandler('error.quickSearch', message);
                
                $('<' + data.container.resultTag + ' />').addClass('error')
                    .text(message)
                    .appendTo(data.container.element);
            });
            
            
        },
        showResults : function( results ) { 
            return this.each(function(){
                var data = $(this).data('quickSearch');

                // Results event
                data.target.triggerHandler('results.quickSearch', results);
                
                for (var index in results) {
                    var content = data.format(results[index]);
                    
                    $('<' + data.container.resultTag + ' />').text(content)
                        .appendTo(data.container.element);
                }
            });
        },
        clear: function() {
            return this.each(function(){
                var data = $(this).data('quickSearch');

                data.container.element.children().remove();
            });
        }
    };

    // TODO JSDoc
    $.fn.quickSearch = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.quickSearch' );
            
            return null;
        }  
    };

    $.fn.quickSearch.template = function(format) {
        for (var index in arguments) {
            format = format.replace('$' + index, arguments[index]);
        }

        return format;
    }

    $.fn.quickSearch.format = function(data, format) {
        var content = new Array();

        for (var name in data) {
            content.push(name + ": " + data[name]);
        }

        content = content.join(', ');

        return content;
    }
    
})( jQuery );