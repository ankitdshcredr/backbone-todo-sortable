/*
    Author:
    Ankit Doshi

    Date-Created:
    8-Dec-2015
    
    File-Name:
    view_header.js

    Description:
    This file is the Header Child View for the Backbone Todo MVC App.
    Contains User Input for adding todo
    Shows total Todos in the App.       
*/

define([
    //Libraries
    'jquery', 'underscore', 'backbone',

    //Configuration
    'config',

    //Event 
    'pubSub',

    //Templates
    'text!header_tmpl'
], function($, _, Backbone,
    Config,
    PubSub,
    TodoHeaderViewTMPL
) {

    var HeaderView = Backbone.View.extend({

        // Create a new <header> Element
        tagName: 'header',
        className: 'todoHeader',
        template: _.template(TodoHeaderViewTMPL),

        events: {
            'keydown input#todoTextBox': 'addTodo',
            'click #buttonAdd': 'addTodo',
            'click #resetTodo': 'resetTodo'
        },

        initialize: function(todos) {
            try {

                // Saving Parent Todos Locally
                this.parentTodos = todos;

                //When A New todo is added than just append it to the list
                PubSub.on('todo:add', this.updateCount, this);
                PubSub.on('todo:remove', this.updateCount, this);

            } catch (ex) {
                console.error('Error in Header Initialization :-  ' + ex.message);
            } finally {

            }
        },
        // Cache Frequently accessed DOM 
        initCache: function() {
            // saving DOM Elements to cache
            this.$inputBox = this.$el.find('input#todoTextBox');
            this.$totalCountBox = this.$el.find('#totalTodo');

        },
        render: function() {

            // Render the Basic Template First 
            this.$el.append(this.template());


            // Caching Frequently accessed DOM 
            this.initCache();

            // Update Count on Initialization
            this.updateCount();

            return this;

        },

        // Update the Total Todos Count
        updateCount: function() {
            this.$totalCountBox.text(this.parentTodos.length);
        },

        // Clear the Input Box
        clearTextBox: function() {
            this.$inputBox.val("");
        },

        // Gets called when User adds a New Todo
        addTodo: function(evt) {

            // If Enter pressed or Button Clicked
            if (evt.keyCode && evt.keyCode == 13 || evt.type == "click") {

                //Reading Input Box
                var todoItem = this.$inputBox.val() || evt.currentTarget.value;


                // ADD ONLY IF SOME VALUE IS PASSED
                if (todoItem.toString().trim()) {
                    // Triggering a create new Todo Event
                    PubSub.trigger('todo:new', todoItem);
                    //Clearing the Text Box
                    this.clearTextBox();

                }

                evt.preventDefault();
                evt.stopPropagation();

            }

        },

        // Triggers todo:reset Event
        resetTodo: function() {
           PubSub.trigger('todo:reset', this.parentTodos);

        },

        updateHeader: function(todoCount) {

            // update total count
            this.headerView.find('totalCount').html = todoCount;

            //clear input
            this.headerView.inputBox = "";

        },
    });

    return HeaderView;
});