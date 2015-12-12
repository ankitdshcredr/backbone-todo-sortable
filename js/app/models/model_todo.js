/*
    Author:
    Ankit Doshi

    Date-Created:
    9-Dec-2015
    
    File-Name:
    model_todo.js

    Description:
    This file contains various the Basic default description for a Todo Model.    
*/


define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Todo = Backbone.Model.extend({

        // Default attributes
        defaults: {
            id: null,
            todo_id: null, // helps generate unique TODO ID
            data: null,
            completed: false,
            type: 'todo', // By Default a new item is 'todo'
            type_id: 0, // By Default a type_id is 0 meaning 'todo'
            title: null,
            sort_position: 10000, //addding a large number so it will always be last
        },

        // Initializing each todo Model
        initialize: function() {

            var uniqueID = this.getUniqueID();
            console.log('TodoItem:-' + uniqueID + ' is created');

            //Setting a better Unique-ID on Model's Initialization 
            this.set({
                'id': uniqueID,
                'todo_id': uniqueID
            }, {
                silent: true
            });


        },

        //Generate Unique-ID on each Model's Initialization
        getUniqueID: function() {

            return _.uniqueId('todo-' + (new Date).getTime() + '-');

        }

    });
    return Todo;

});