/*
    Author:
    Ankit Doshi

    Date-Created:
    8-Dec-2015
    
    File-Name:
    pubsub.js

    Description:
    This Backbone Todo MVC App uses Publisher-Subscriber Pattern. 

    
*/



define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var PubSub = _.extend({}, Backbone.Events);
    return PubSub;

});