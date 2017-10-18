const util = require('util');
const EventEmitter = require('events').EventEmitter;

function Observer() {
    this.calculated = function(data) { 
        this.emit('calculated', data);
    }

    this.error = function (message) {
        this.emit('error', message);
    }
}

util.inherits(Observer, EventEmitter);

module.exports = Observer;
