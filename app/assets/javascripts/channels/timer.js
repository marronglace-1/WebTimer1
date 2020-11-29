App.timer = App.cable.subscriptions.create("TimerChannel", {
  connected: function() {
    
    // Called when the subscription is ready for use on the server
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
    // Called when there's incoming data on the websocket for this channel
  },

  timer_set: function(selectContent, setTime, hour) {
    return this.perform('timer_set', {list_id: selectContent, minute: setTime, hour: hour});
  },

  list_set: function(list_id, list_content, contentName) {
    return this.perform('list_set', {list_id: list_id, list_content: list_content, list_name: contentName});
  }
});

