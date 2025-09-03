(function () {
  const blockDefinition = {
    name: 'sb-custom-widget-recognition-feed',
    factory: ({ configuration }) => {
      return (el, ctx) => {
        // Clear container
        el.innerHTML = '';
        const token = configuration.token || '';
        const limit = configuration.limit || 10;
        const container = document.createElement('div');
        container.textContent = 'Loading recognition feed...';
        el.appendChild(container);

        const url = `https://bonus.ly/api/v1/bonuses?limit=${limit}`;
        fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            container.innerHTML = '';
            if (data && Array.isArray(data.data)) {
              const list = document.createElement('ul');
              data.data.forEach(item => {
                const li = document.createElement('li');
                const giver = (item.giver && item.giver.display_name) || 'Someone';
                const receivers = Array.isArray(item.receivers)
                  ? item.receivers.map(r => r.display_name || '').join(', ')
                  : '';
                const message = item.message || '';
                li.textContent = `${giver} recognized ${receivers}: ${message}`;
                list.appendChild(li);
              });
              el.appendChild(list);
            } else {
              container.textContent = 'No recognitions found or invalid data.';
            }
          })
          .catch(err => {
            container.textContent = 'Error fetching recognition feed: ' + err.message;
          });
      };
    },
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
          default: 10,
          minimum: 1,
          maximum: 50
        }
      },
      required: ['token']
    },
    uiSchema: {
      token: { 'ui:widget': 'password' },
      limit: { 'ui:widget': 'updown' }
    },
    label: 'Bonusly Recognition Feed'
  };

  if (window && window.defineBlock) {
    window.defineBlock(blockDefinition);
  } else {
    console.error('Staffbase SDK is not available.');
  }
})();
