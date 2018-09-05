// Let's check if the browser supports notifications
if (!("Notification" in window)) {
  alert("This browser does not support notifications");
}

const screens = ['#loading-screen', '#input-screen', '#search-screen'];
// Replace with HGE_URL
const HGE_URL = 'https://hasura-serverless-etl.herokuapp.com/v1alpha1/graphql';

function showScreen(name) {
  for (screen of screens) {
    screen === name ? $(screen).show() : $(screen).hide();
  }
}

function resetSaveButton() {
  $('#save-button').html('✅ Save');
}

function saveBook() {
  const title = $('#book-title').val();
  const author = $('#book-author').val();

  if (!title || !author) {
    $('#error-text').html('✋ Enter title, author and try again');
    return;
  }

  $('#save-button').html('🏃‍️ Saving...');

  const r = new Request(HGE_URL);
  const o = {
    method: 'POST',
    body: JSON.stringify({
      query: `
        mutation insertBook($title: String!, $author: String!) {
          insert_book(objects:[{
            title: $title,
            author: $author
          }]) {
            returning { id }
          }
        }
      `,
      variables: { title, author }
    })
  };
  fetch(r, o).then(function(response) {
    if (response.status === 200) {
      console.log('request sent to server');
      showScreen('#search-screen');
      resetSaveButton();
    } else {
      console.error('An error happened while sending the request', response.statusText);
      $('#error-text').html('🛑 An error happened, check console for details');
      resetSaveButton();
    }
  }).catch(function(err) {
    console.error('An error happened while sending the request', err);
    $('#error-text').html('🛑 An error happened, check console for details');
    resetSaveButton();
  });

}

$( document ).ready(function() {
  $('#text-input').on('keyup', function (e) {
    if (e.keyCode == 13) {
    }
  });

  $('#hge-console-link').attr('href', HGE_URL.replace('v1alpha1/graphql', 'console'));

  showScreen('#input-screen');
});

var search = instantsearch({
  // Replace with your own values
  appId: 'WCBB1VVLRC',
  apiKey: '8effee2588d61678501731405a86394d', // search only API key, no ADMIN key
  indexName: 'demo_serverless_etl_app',
  routing: true,
  searchParameters: {
    hitsPerPage: 10
  }
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-box'
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    }
  })
);

search.start();
