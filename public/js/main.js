$(document).ready(function() {

  var $toggleSearch = $('.toggle-search');
  var $search = $('.search-input');
  var $results = $('.search-results');


  $(document).ready(function() {
    var client = algoliasearch('C0VEZQ8DEQ', '75938b40b5ad140ce81b4d25a8788115');
    var index = client.initIndex('builds');

    $toggleSearch.on('click', function () {
      $search.addClass('active').focus();
      $results.addClass('active');
    });

    $search.keyup(function() {
      if ($search.val().trim()) {
        index.search($search.val(), {
          hitsPerPage: 10,
          facets: '*'
        }, searchCallback);
      } else {
        $results.empty();
      }
    }).focus();
  });

  function searchCallback(err, content) {
    if (err) {
      console.error(err);
      return;
    }

    $results.empty();

    console.log(content);

    for (var i = 0; i < content.hits.length; i++) {
      var template = '';
      template += '<a class="search-result" href="/builds/' + content.hits[i]._id + '">';
      template += '  <div class="search-result__inner">';
      template += '    <div class="search-result__preview" style="background-size:contain; background-image:url(\'/images/' + content.hits[i].image + '\')"></div>';
      template += '    <div class="search-result__content">' + content.hits[i].name + '</div>';
      template += '  </div>';
      template += '</a>';

      $results.append(template);
    }

    $results.append('<div class="search-result__meta">' + content.nbHits + ' results in ' + content.processingTimeMS + ' ms</div>');
  };

});
