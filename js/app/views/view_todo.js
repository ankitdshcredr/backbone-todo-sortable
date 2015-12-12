/*
    Author:
    Ankit Doshi

    Date-Created:
    8-Dec-2015
    
    File-Name:
    view_todo.js

    Description:
    This file is the Main File for Initializing / Creating the Backbone Todo MVC App.

    This will handle the 3 TodoList View (Todo / In Progress / Completed)
    This will handle Pub-Sub events (Add Item / Remove Item / Update Item)
    this will handle localStorage (useful to populate the ToDo's Item from a previous Session)     
*/


define([
    // Libraries
    'jquery', 'underscore', 'backbone',

    // Utilities
    'config', 

    // Events
    'pubSub',

    // Models
    'todo',

    // Collection
    'todos',

    // Views
    'todo_header_view', 'todo_list_view'
], function($, _, Backbone,
    Config, 
    PubSub,
    Todo,
    Todos,
    TodoHeaderView, TodoListView
) {

    var RootView = Backbone.View.extend({


        // Defines the Node where the this View will be appended
        el: Config.ROOT_ELEMENT || '#todoApp',
        //tagName: 'section',
        className: 'appContainer',

        // No Template Required Since this Acts like a Blank Parent View Controller
        // Any template required will be by the child Views
        //template: _.template(),

        events: {

        },

        // Localstorage Key Name
        key: Config.LOCALSTORAGE_KEY,

        initialize: function() {
            try {

                // Read from localstorage , if todo present from previous session
                // Creating Todo Collection 
                this.todos = new Todos(this.fetch());



                // Collection Listeners:-
                this.todos.on('add', this.addTodo, this);



                // Pub-Sub Listeners:-
                PubSub.on('todo:new', this.createTodo, this);
                PubSub.on('todo:remove', this.removeTodo, this);
                PubSub.on('todo:reset', this.resetTodo, this);


                PubSub.on('todo:sorted', this.updateTodo, this);
                PubSub.on('todo:updated', this.updateTodo, this);


                // Start Rendering the Main Todo MVC App.
                this.render();

            } catch (ex) {
                console.error('INITIALIZATION ERROR :-  ' + ex.message);
            } finally {

            }
        },

        // Renders the Main Todo App 
        render: function() {

            // Create the fragment (helps eases rendering)
            var fragment = document.createDocumentFragment(); //http://ejohn.org/blog/dom-documentfragments/



            /* -----HEADER SECTION-----*/
            TodoHeaderView.prototype.parent = this;
            this.headerView = new TodoHeaderView(this.todos); //Appending Top header view           
            //this.headerView.parent = this; // saving parent on child view
            fragment.appendChild(this.headerView.render().el); //Appending to fragment



            /* -----TODO SECTION-----*/
            this.todoView = new TodoListView(this.todos, 'TODO');
            //this.todoView.parent = this; // saving parent on child view
            fragment.appendChild(this.todoView.render().el);



            /* -----PROGRESS SECTION-----*/
            this.progressView = new TodoListView(this.todos, 'INPROGRESS');
            //this.todoView.parent = this; // saving parent on child view
            fragment.appendChild(this.progressView.render().el);



            /* -----COMPLETED SECTION-----*/
            this.completedView = new TodoListView(this.todos, 'COMPLETED');
            //this.todoView.parent = this; // saving parent on child view
            fragment.appendChild(this.completedView.render().el);



            // Adding a clearfix Element
            var clearDiv = document.createElement('div');
            clearDiv.setAttribute('style', 'clear:both')
            fragment.appendChild(clearDiv);


            // Appending The Virtual-DOM Fragment to $el
            this.$el.append(fragment);

            return this;

        },

        // Creates a Todo Model and adds it to the Collection
        createTodo: function(todoTitle) {

            // create Todo item model
            var todo = new Todo({
                title: todoTitle
            });

            //Add to collection
            this.todos.add(todo);
        },

        // Triggerred By Addition to Collection 
        addTodo: function(todo) {

            // Save the new Collection to Localstorage 
            this.save();

            // Trigger todo add Event for any child listener 
            PubSub.trigger('todo:add', this.todos);

        },

        // Removes a todo from the Collection
        removeTodo: function(todo) {
            // Remove a particular todo from the Collection
            this.todos.remove(todo);
            // Save the new Collection to Localstorage 
            this.save();
        },

        // Save the new Collection to Localstorage
        updateTodo: function(todos) {

            this.save();

        },

        // Remove All Todos and Reload App
        resetTodo: function() {

            // Delete Localstorage
            this.delete();

            // Calls Backbone Collection Reset, this will Empty the Collection
            this.todos.reset();

            //Reload page
            this.reloadPage();
        },

        // Reload the Page 
        reloadPage: function() {
            // Hard Reload Page
            location.reload(true);
        },

        // Save to Localstorage
        save: function() {
            var todos = this.todos.toJSON();

            localStorage.setItem(this.key, JSON.stringify(todos));
        },

        // Delete From Localstorage
        delete: function() {
            localStorage.removeItem(this.key);
        },

        // Fething from localstorage
        fetch: function() {
            var todos = JSON.parse(localStorage.getItem(this.key));
            return todos;
        }

    });

    return RootView;
});