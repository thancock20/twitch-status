$(document).ready(function() {

  var usernames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "medrybw", "brunofin", "comster404"];
  
  // counter to keep track of number of times the ajax calls have been run
  var counter = 0;
  
  usernames.forEach(function(user) {
    
    // URLs for the ajax calls
    var userURL = 'https://api.twitch.tv/kraken/users/' + user + '?callback=?';
    var streamURL = 'https://api.twitch.tv/kraken/streams/' + user + '?callback=?';

    // grab and work on the user object
    $.getJSON(userURL, function(data) {
      
      // variables to hold data from the user object
      var icon = data.logo ? data.logo : 'http://placehold.it/50x50';
      var iconElem = '<img src="' + icon + '" class="icon">';
      var userName = data.display_name;
      var urlElem = 'http://twitch.tv/' + user;

      // grab and work on the streams object
      $.getJSON(streamURL, function(data) {
        // variables used to build the list item for the user
        var faIcon, faClass, faTip, info, faElem, onlineElem, infoElem, userItem;
        
        // build and display the list item for the user
        if (data.error) { // for a closed account
          faIcon = 'fa-times-circle';
          faTip = 'Account Closed';
          faElem = '<i class="fa ' + faIcon + '" data-toggle="tooltip" title="' + faTip + '"></i>';
          onlineElem = '<span class = "online-status">' + faElem + '</span>';
          userItem = '<div class="user-item closed">' + iconElem + ' ' + userName + onlineElem + '</div>';
          $('#user-list').append('<li>' + userItem + '</li>');
        } 
        else {
          if (data.stream) { // for a streaming account
            faIcon = 'fa-check-circle';
            faClass = 'online';
            faTip = 'Currently Streaming';
            info = data.stream.channel.status;
          } else { // for a non-streaming account
            faIcon = 'fa-exclamation-circle';
            faClass = 'offline';
            faTip = 'Not Streaming'
            info = '';
          }
          faElem = '<i class="fa ' + faIcon + ' ' + faClass + '" data-toggle="tooltip" title="' + faTip + '"></i>'
          onlineElem = '<span class="online-status">' + faElem + '</span>';
          infoElem = '<p class="info">' + info + '</p>';
          userItem = '<div class="user-item">' + iconElem + ' ' + userName + onlineElem + infoElem + '</div>';
          $('#user-list').append('<li><a href="' + urlElem + '" target="_blank">' + userItem + '</a></li>');
        }
        
        counter++; // counter will hold number of times the ajax calls have been run
        
        // on the last call, initialize the tooltips and searchbox
        if (counter >= usernames.length) {
          initialize();
        }
        
      }); // getJSON - streamURL
      
    }); // getJSON - userURL

  }); // username.forEach

  // initializes the tooltips and searchbox
  function initialize() {
    $('[data-toggle="tooltip"]').tooltip();
    $('#user-list').searcher({
      itemSelector: "li",
      textSelector: ".user-item",
      inputSelector: "#search-box"
    });
  };
  
});