/*
    Author:
    Ankit Doshi

    Date-Created:
    9-Dec-2015
    
    File-Name:
    collection_todos.js

    Description:
    This file will create Backbone Collection for Todo Models

    
*/

define(['jquery', 'underscore', 'backbone', 'todo'], function($, _, Backbone, Todo) {

    var Todos = Backbone.Collection.extend({
        model: Todo
    });

    return Todos;

});