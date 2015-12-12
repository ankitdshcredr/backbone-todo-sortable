/*
    Author:
    Ankit Doshi

    Date-Created:
    8-Dec-2015
    
    File-Name:
    main.js

    Description:
    This file will be loaded by erquireJS.
    Contains the path of various files required for the TODO App
    Contains RequireJS Configurations.

*/
require.config({
    baseUrl: ".",

    paths: {
        //DOM MANIPULATION LIBRARY
        "jquery": "./js/libs/jquery/jquery-2.1.4",

        //GENERAL TEMPLATING/UTILITY LIBRARY
        "underscore": "./js/libs/underscore/underscore-1.8.3",

        //BACKBONE
        'backbone': './js/libs/backbone/backbone-1.2.3',

        //Backbone.localstorage:-   https://github.com/jeromegn/Backbone.localStorage
        // 'localStorage': './js/libs/backbone/backbone.localStorage',


        //Basic Publish-Subscriber Pattern
        'pubSub': './js/app/pubsub',

        //REQUIREJS TEXT PLUG-IN - Load text files and treat them as dependencies.  http://requirejs.org/docs/download.html#text
        //Great for loading templates. The text strings can be inlined in an optimized build when the optimizer is used.
         'text': './js/libs/requirejs/text-2.0.14',

        

        //CONFIG - contains the various Render Configuration
        'config': './js/app/config/config',


        //Sortable- https://github.com/RubaXa/Sortable
        // Sortable — is a minimalist JavaScript library for reorderable drag-and-drop lists on modern browsers and touch devices. No jQuery. 
        'Sortable': './js/libs/sortable/sortable',

        //VIEWS
        'todo_app_view': './js/app/views/view_todo',        
        'todo_header_view': './js/app/views/view_header',
        'todo_list_view': './js/app/views/view_todoList',


        //MODELS
        'todo': './js/app/models/model_todo',


        //COLLECTIONS
        'todos': './js/app/collections/collection_todos',


        //TEMPLATES
        'todolist_tmpl': './js/app/templates/template_todolist.html',
        'header_tmpl': './js/app/templates/template_todo_header.html',
        'todo_tmpl': './js/app/templates/template_todo.html'


    },
    waitSeconds: 20,
    shim: {
        'jquery': {
            exports: '$'
        },              
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});









/*STARTING THE APP*/
require(['todo_app_view'], function(ToDoApp) {

    // This Will Start the Backbone Todo MVC App, Once All files are fetched by RequireJS.
    var app = new ToDoApp();

});