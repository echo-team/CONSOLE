var core = new Core(),
    button = new Button({core: core}),
    plugins = new Plugins({parent: document.head});


/**
 * Button initialization
 */

core.console.onOpened(
    function()
    {
        button.changeState(true);
    }
);

core.console.onClosed(
    function()
    {
        button.changeState(false);
    }
);


/**
 * Plugins initialization
 */

let plug =
    [
        {
            background: null,
            content: null,
            page: null
        }
    ];
