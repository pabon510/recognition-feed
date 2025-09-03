(function() {
  const blockDefinition = {
    name: 'recognition-feed',
    factory: ({ configuration }) => {
      class RecognitionFeed extends HTMLElement {
        connectedCallback() {
          const token = configuration.token || '';
          const limit = configuration.limit || 5;
          const container = document.createElement('div');
          container.textContent = 'Loading recognition feed...';
          this.appendChild(container);
          const url = 'https://bonus.ly/api/v1/bonuses?limit=' + limit;
          fetch(url, {
            headers: {
              Authorization: 'Bearer ' + token
            }
          })
            .then(response => response.json())
            .then(data => {
              container.innerHTML = '';
              if (data && data.result) {
                const list = document.createElement('ul');
                data.result.forEach(item => {
                  const li = document.createElement('li');
                  const giver = item.giver && item.giver.display_name ? item.giver.display_name : 'Someone';
                  let receivers = '';
                  if (Array.isArray(item.receivers)) {
                    receivers = item.receivers.map(function(r) { return r.display_name; }).join(', ');
                  }
                  const message = item.message || '';
                  li.textContent = giver + ' recognized ' + receivers + ': ' + message;
                  list.appendChild(li);
                });
                container.appendChild(list);
              } else {
                container.textContent = 'No recognitions found.';
              }
            })
            .catch(function(err) {
              container.textContent = 'Error fetching recognition feed: ' + err.message;
            });
        }
      };
      if (!customElements.get('recognition-feed')) {
        customElements.define('recognition-feed', RecognitionFeed);
      }
      return document.createElement('recognition-feed');
    },
    configurationSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', title: 'Bonusly API Token' },
        limit: { type: 'number', title: 'Number of recognitions', default: 5 }
      },
      required: ['token']
    },
    uiSchema: {
      token: {
        'ui:widget': 'password',
        'ui:help': 'Provide your Bonusly API token'
      },
      limit: {
        'ui:help': 'Number of recognition entries to display'
      }
    },
    label: 'Bonusly Recognition Feed'
  };

  if (typeof window !== 'undefined' && window.defineBlock) {
    window.defineBlock(blockDefinition);
  }
})();
