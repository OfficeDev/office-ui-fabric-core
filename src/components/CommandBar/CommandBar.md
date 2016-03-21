# Command Bar
Commanding surface for panels, pages, and applications. Unlike the NavBar, this component should not navigate to other pages.

## Variants

### Default
@@include('CommandBar.html')

## States
State | Applied to | Result
 --- | --- | ---
`.is-hidden` | `.ms-CommandBarItem` | Hides a Command Bar item from view.
`.is-active` | `.ms-CommandBarSearch` | Expands the search field for use.

## Using this component
1. Confirm that you have references to Fabric's CSS and JavaScript on your page, as well as jQuery:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
        <script src="jquery-2.2.1.min.js"></script>
        <script src="jquery.fabric.min.js"></script>
    </head>
    ```
2. Copy the HTML from the sample above into your page. For example:
    ```
    <div class="ms-CommandBar">
        <div class="ms-CommandBarSearch">
            <input class="ms-CommandBarSearch-input" type="text" placeholder="Search" tabindex="1"/>
            <div class="ms-CommandBarSearch-iconWrapper ms-CommandBarSearch-iconSearchWrapper">
            <i class="ms-Icon ms-Icon--search"></i>
            </div>
            <div class="ms-CommandBarSearch-iconWrapper ms-CommandBarSearch-iconClearWrapper ms-font-s">
            <i class="ms-Icon ms-Icon--x"></i>
            </div>
        </div>  
        <div class="ms-CommandBar-sideCommands">
            <div class="ms-CommandBarItem">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-icon ms-Icon ms-Icon--reactivate"></span>
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Undo</span>
                <i class="ms-CommandBarItem-chevronDown ms-Icon ms-Icon--chevronDown"></i>
                </a>
            </div>
            </div>
        </div>
        <div class="ms-CommandBar-mainArea">
            <div class="ms-CommandBarItem">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-icon ms-Icon ms-Icon--star"></span>
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">New</span>
                <i class="ms-CommandBarItem-chevronDown ms-Icon ms-Icon--chevronDown"></i>
                </a>
            </div>
            </div>
            <div class="ms-CommandBarItem">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-icon ms-Icon ms-Icon--save"></span>
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Delete</span>
                </a>
            </div>
            </div>
            <div class="ms-CommandBarItem">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-icon ms-Icon ms-Icon--flag"></span>
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Archive</span>
                </a>
            </div>
            </div>
            <div class="ms-CommandBarItem ms-CommandBarItem--hasTextOnly">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Junk</span>
                </a>
            </div>
            </div>
            <div class="ms-CommandBarItem ms-CommandBarItem--hasTextOnly">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Move To</span>
                <i class="ms-CommandBarItem-chevronDown ms-Icon ms-Icon--chevronDown"></i>
                </a>
            </div>
            </div>
            <div class="ms-CommandBarItem ms-CommandBarItem--hasTextOnly">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="1">
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Categories</span>
                <i class="ms-CommandBarItem-chevronDown ms-Icon ms-Icon--chevronDown"></i>
                </a>
            </div>
            </div>
            <!-- Overflow Command -->
            <div class="ms-CommandBarItem ms-CommandBarItem--iconOnly ms-CommandBarItem-overflow">
            <div class="ms-CommandBarItem-linkWrapper">
                <a class="ms-CommandBarItem-link" tabindex="2">
                <span class="ms-CommandBarItem-icon ms-Icon ms-Icon--ellipsis"></span>
                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Ellipsis</span>
                <i class="ms-CommandBarItem-chevronDown ms-Icon ms-Icon--chevronDown"></i>
                </a>
            </div>
            <ul class="ms-CommandBar-overflowMenu ms-ContextualMenu"></ul>
            </div>
            <!-- End Overflow Command -->
        </div>
    </div>
    ```
3. Add the following `<script>` tag to your page to instantiate all CommandBar components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.CommandBar) {
                $('.ms-CommandBar').CommandBar();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as `.ms-CommandBarItem` elements) with your content.

## Dependencies
This component has no dependencies.

## Accessibility
Refer to the sample code to see how `tabindex` attributes should be set to support keyboard navigation.
