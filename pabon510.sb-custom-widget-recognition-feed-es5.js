(function() {
  var blockDefinition = {
    name: 'recognition-feed',
    factory: function(args) {
      var configuration = args.configuration;
      return function(el, ctx) {
        el.innerHTML = '';
        var token = configuration.token || '';
        var limit = configuration.limit || 10;
        var container = document.createElement('div');
        container.textContent = 'Loading recognition feed...';
        el.appendChild(container);

        var url = 'https://bonus.ly/api/v1/bonuses?limit=' + limit;
        fetch(url, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          container.innerHTML = '';
          if (data && Array.isArray(data.data)) {
            var list = document.createElement('ul');
            data.data.forEach(function(item) {
              var li = document.createElement('li');
              var giver = item.giver && item.giver.display_name ? item.giver.display_name : 'Someone';
              var receivers = '';
              if (Array.isArray(item.receivers)) {
                receivers = item.receivers.map(function(r) {
                  return r.display_name || '';
                }).join(', ');
              }
              var message = item.message || '';
              li.textContent = giver + ' recognized ' + receivers + ': ' + message;
              list.appendChild(li);
            });
            el.appendChild(list);
          } else {
            container.textContent = 'No recognitions found or invalid data.';
          }
        }).catch(function(error) {
          container.textContent = 'Error fetching recognition feed: ' + error.message;
        });
      };
    },
    attributes: {},
    configurationSchema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          title: 'Bonusly API Token'
        },
        limit: {
          type: 'integer',
          title: 'Number of recognitions',
          "default": 10,
          minimum: 1,
          maximum: 50
        }
      },
      required: ['token']
    },
    uiSchema: {
      token: {
        'ui:widget': 'password'
      },
      limit: {
        'ui:widget': 'updown'
      }
    },
    label: 'Bonusly Recognition Feed'
  };

  if (window && window.defineBlock) {
    window.defineBlock(blockDefinition);
  } else {
    console.error('Staffbase SDK is not available.');
  }
})();
