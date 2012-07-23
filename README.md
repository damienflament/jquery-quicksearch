jQuery QuickSearch
==================

This jQuery plugin enables fast asynchronous searching using a simple `<input \>` HTML element.

Support
-------
Please report bugs using the [issues reporting system](https://github.com/damienflament/jquery-quicksearch/issues).

Simple example
--------------
### HTML ###

    <html>
        <head>
            <title>jQuery QuickSearch simple example</title>
        </head>
        <body>
            <form action="#" >
                <input type="text" id="searchTerms" />
            </form>
        </body>
    </html>
    

### Javascript ###

    $(function() {
        $('#searchTerms').quickSearch({
            url: 'search.php'
        });
    });
