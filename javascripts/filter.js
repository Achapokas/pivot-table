

const request = function(){
  const bytes = new Request('https://achapokas.github.io/pivot-table/javascripts/bytes.json');

  fetch(bytes)
    .then(function(response) {
      return response.json();
    })
    .catch(function(reponse){
      return 'Request failed to complete'
    })
    .then(function(json){
      insertTbody(json)
    });
},

seedTable = function(results) {

  const template = `<tbody>
    ${results.map((i) => `
      <tr>
        <td>${i["All_Traffic.dest"]}</td>
        <td>${i["All_Traffic.src"]}</td>
        <td>${i.sum_bytes}</td>
      </tr>`
    ).join('')}
  </tbody>`

  return template
},

clone = function(address, event) {
  var target = event.target,
      targetText = target.innerHTML;

   address.setAttribute("value", targetText);
},

sortRows = function(td, tr, inputValue, i) {
  if (td) {
    if(inputValue === td.innerHTML) {
      tr.style.display = ""
    } else {
      tr.style.display = "none"
    }
  }
}

setsFilter = function(select, address) {
  const selectIndex = select.options[select.selectedIndex].text,
        inputValue = address.value,
        tr = document.getElementsByTagName("tr");

    if ( selectIndex === "Destination" ) {
      for(var i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[0];

        sortRows(td, tr[i], inputValue, i)
      }
    } else {
      for(var i = 0; i < tr.length; i++) {
          var td = tr[i].getElementsByTagName("td")[1];

          sortRows(td, tr[i], inputValue, i)
      }
    }
}

insertTbody = function(json) {
  const table = document.getElementById("pivot"),
        thead = document.getElementById("thead"),
        form = document.forms["filter"],
        address = form.elements["address"],
        select = form.elements["filter-by"],
        reset = form.elements["reset"],
        tr = document.getElementsByTagName("tr");

  var results = [],
      dests = [];

  for(var i = 0; i < json.length; i++){
    const result = json[i].result,
          resultDest = result["All_Traffic.dest"]

          results.push(result)
          dests.push(resultDest)
  }

  thead.insertAdjacentHTML('afterEnd', seedTable(results));

  table.addEventListener("click", function(event){ clone(address, event) })

  form.addEventListener("submit", function(event) { event.preventDefault(); setsFilter(select, address)})

  reset.addEventListener("click", function(event){
    event.preventDefault();
    for (var i = 0; i < tr.length; i++) {
      tr[i].removeAttribute("style")
    }
  })

window.onbeforeunload = function(){
  for(var i = 0; i < tr.length; i++) {
    sessionStorage.setItem('style' + [i], tr[i].style.display)
  }
}

window.onload = function() {
  for(var i = 0; i < tr.length; i++) {
    var test = sessionStorage.getItem('style' + [i]);

    tr[i].style.display = test
  }
}

  // Store session storage
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  // If input value returns empty string alert user
  // Validation on "blur" provide a tooltip for user to include IP address
}

request()
