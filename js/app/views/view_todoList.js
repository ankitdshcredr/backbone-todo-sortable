/*
    Author:
    Ankit Doshi

    Date-Created:
    8-Dec-2015
    
    File-Name:
    view_todoList.js

    Description:
    This file will create the Various Todo Columns for Backbone Todo MVC App.

    Shows Column Header
    Shows this Todos Count
    Allows Sorting of todos on itself
    Allows Todos to be Added / Removed From/ to an other Column      
*/

define([
    //libraries
    'jquery', 'underscore', 'backbone',

    //UTILITIES
    'config',

    //Event 
    'pubSub',

    //Sorting Library
    'Sortable',

    //TEMPLATES
    'text!todolist_tmpl', 'text!todo_tmpl'
], function($, _, Backbone,
    Config,
    PubSub,
    Sortable,
    TodolistViewTMPL, TodoViewTMPL
) {

    var TodoListView = Backbone.View.extend({

        tagName: 'article',
        className: 'itemList',
        listTemplate: _.template(TodolistViewTMPL),
        todoTemplate: _.template(TodoViewTMPL),
        events: {
            'click .todoItemDelete': 'removeClicked',
        },

        //Saving sortable Plugin on this View
        Sortable: Sortable,

        // Initialize Todo List Column
        initialize: function(todos, type) {
            try {

                // Saving Parent Todos Locally
                this.parentTodos = todos;

                // Saving Current List Types Configuration locally
                this.config = Config['ALL_TODO_LIST'][type];


                // Sorting Parent List on 'sort_position'
                var sortedTodos = this.parentTodos.sortBy('sort_position');

                // Filtering Todos based on the Current list Type
                var filteredTodos = _.filter(sortedTodos, function(todo, idx, List) {

                    return todo.get('type_id') == this.config['type_id'];
                }, this);

                // Creating & Saving Local Todo Collection
                var ToDoCollection = Backbone.Collection.extend({});
                this.todos = new ToDoCollection(filteredTodos);


                // Collection Listeners:-
                this.todos.on('add', this.updateCount, this);


                // Pub-Sub Listeners:-
                //When A New todo is added than just append it to the list
                if (this.config.listenTo['add']) {
                    PubSub.on('todo:add', this.appendTodo, this);
                }
                if (this.config.listenTo['remove']) {
                    PubSub.on('todo:remove', this.removeTodo, this);

                }




            } catch (ex) {
                console.error("Error in " + this.config.header + " Initialization :-  " + ex.message);
            } finally {

            }
        },

        // Cache Frequently Accessed DOM to this View 
        initCache: function() {

            // Cache Total-Count View
            this.$TodoCount = this.$el.find('#todoCount');
            //Cache Complete Todo List View 
            this.$TodoList = this.$el.find('ul#' + this.config.type + 'List');

        },

        // Initialize Sorting capabilities on This Todo List
        initSortable: function() {

            var that = this;

            this.Sortable.create(this.$TodoList[0], {

                group: "todos",
                animation: 150,
                onAdd: function(evt) {
                    console.log('onAdd.todos:', [evt.item, evt.from]);


                    var todoItem = evt.item;
                    todoId = evt.item.getAttribute('id');

                    //Initiating the Transfer of the Todo
                    that.receiveTodo(todoId);


                },
                onRemove: function(evt) {

                    var todoItem = evt.item;
                    todoId = evt.item.getAttribute('id');

                    //Initiating the Transfer of the Todo
                    that.sendTodo(todoId);

                    console.log('onRemove.todos:', [evt.item, evt.from]);
                },
                onUpdate: function(evt) {
                    var item = evt.item; // the current dragged HTMLElement

                    that.updateSortPosition();
                },
                onStart: function(evt) {
                    console.log('onStart.todos:', [evt.item, evt.from]);
                },
                onSort: function(evt) {
                    console.log('onStart.todos:', [evt.item, evt.from]);
                },
                onEnd: function(evt) {
                    console.log('onEnd.todos:', [evt.item, evt.from]);
                }
            });
        },

        // Render will be called by parent
        render: function() {


            var template = "";

            // Firstly Set the Empty Template on this.$el
            this.$el.append(this.listTemplate(this));


            // Caching Frequently accessed DOM after Append Operation 
            this.initCache();


            //creating Each ToDo View and Appending to cache
            this.todos.each(function(todo) {

                template = this.createTodoView(todo)
                    // Secondy Set the Todo Items to the Cache List
                    // Appending each Todo Item 
                this.$TodoList.append(template);

            }, this);

            // Updating Local Todo Count after Append Operation
            this.updateCount();

            // Initialing Sorting capability after Append Operation, putting a small delay
            setTimeout((function() {
                this.initSortable();
            }).bind(this), 10);


            return this;

        },

        // Update the Todos Collection After List finished sorting 
        updateSortPosition: function() {


            // Fetch All Todo Item View from the Current List
            var todoList = this.$TodoList.find('li.todoItem');

            // Updating Each Todo Item in the Local collection
            _.each(todoList, function(item, idx, list) {

                // Get the Todo ID
                var todoId = item.getAttribute('id');

                // Fetch Local Todo
                var todoModel = this.getLocalTodo(todoId);


                // Updating the Item's Sort Position
                todoModel.set({
                    'sort_position': idx + 1
                }, {
                    silent: true
                });


            }, this);

            // Triggering Update Event , Parent will listen and save the new todoList to localstorege  
            PubSub.trigger('todo:updated', this.todos);
        },

        appendTodo: function(todos) {

            // Getting the Latest Model in the Collection
            var newestTodo = todos.last() || thjis.parentTodos.lest();

            // Adding Todo to Local Collection
            this.addLocalTodo(newestTodo);

            // Create a single Todo View
            var newTodoView = this.createTodoView(this.todos.last());

            // Append the New Todo View to the list  
            this.$TodoList.append(newTodoView);


            //Update Sorting Position After Update New Todo Addition
            this.updateSortPosition();
        },

        //take a Todo Model and return the view
        createTodoView: function(todo, idx, todoList) {

            return this.todoTemplate(todo.toJSON());


        },

        // Adding Todo to Local Collection
        addLocalTodo: function(todo) {
            return this.todos.add(todo);
        },

        // Get Todo From Local Collection
        getLocalTodo: function(todoId) {
            return this.todos.get(todoId);
        },

        // Get Todo From Parent Collection
        getParentTodo: function(todoId) {
            return this.parentTodos.get(todoId);
        },

        // Modifying Todo to Current Type
        modifyTodo: function(todo) {

            // Updating Multiple Parameters (Silently) at once.
            todo.set({
                'type': this.config.type,

                'type_id': this.config.type_id

            }, {
                silent: true
            });

            return todo;

        },

        // Converts a Newly Recieved Todo to Current Type and Save to Local Collection  
        convertToMyTodo: function(todoId) {

            // Fetching Todo from Parent using ID
            var todo = this.getParentTodo(todoId);


            // Modifying Todo to Current Type
            todo = this.modifyTodo(todo);


            // Adding Todo to Local Collection
            this.addLocalTodo(todo);

            // Update Sorting order After New Todo Addition
            this.updateSortPosition();

            // Triggering Update Event , Parent will listen and save the new todoList to localstorege  
            PubSub.trigger('todo:updated', this.parentTodos);
        },

        // Completely Remove's the Todo from this List Type 
        sendTodo: function(todoId) {

            // Fetch the Todo that is being sent to other List 
            var todo = this.todos.get(todoId);


            // Completely Remove's the Fetched Todo from Current List Type 
            this.removeTodo(todo);
        },

        // Receive a Todo from External List
        receiveTodo: function(todoId) {

            // convert the new todoItem to current type
            this.convertToMyTodo(todoId);
        },

        // Removes a Todo when corresponding Remove Icon Clicked 
        removeClicked: function(evt) {
            var todoId = evt.currentTarget.getAttribute('todoid');

            // Fetch Todo from 
            var todo = this.getLocalTodo(todoId);

            // Trigger Remove Todo Event with the Current Removed TodoItem
            PubSub.trigger('todo:remove', todo);
        },

        // Completely Remove's the Todo from Current List Type 
        removeTodo: function(todo) {
            this.removeTodoFromCollection(todo)
            this.removeTodoFromView(todo);
            this.updateCount(this.todos);
        },

        // Remove from Local Collection
        removeTodoFromCollection: function(todo) {
            //Removing the current model from this collection
            var removedTodo = this.todos.remove(todo);
        },

        // Remove from DOM View
        removeTodoFromView: function(todo) {

            var todoID = todo.get('id');
            var $todoItem = this.$TodoList.find('#' + todoID);

            if ($todoItem) {
                //Removing todo item from view
                $todoItem.remove();
                console.log('Todo Removed by User:- ' + todoID);

            }

        },

        // Update Local Todo Collection Count on View
        updateCount: function() {
            this.$TodoCount.text(this.todos.length);

        }

    });

    return TodoListView;
});