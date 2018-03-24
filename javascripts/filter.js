const bytes = new Request('https://achapokas.github.io/pivot-table/javascripts/bytes.json');

fetch(bytes)
  .then(function(response) {
    return response.json();
  })
  .then(function(json){
    console.log(json);
  });
