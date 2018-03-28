

const request = function(){
  const bytes = new Request('https://achapokas.github.io/pivot-table/javascripts/bytes.json');

  fetch(bytes)
    .then(function(response) {
      return response.json();
    })
    .catch(function(reponse){
      return 'Request not made'
    })
    .then(function(json){
      insertTbody(json)
    });
},

seedTable = function(results) {
  let output = results.map((i) => {
    return `<tr>
              <td>${i["All_Traffic.dest"]}</td>
              <td>${i["All_Traffic.src"]}</td>
              <td>${i.sum_bytes}</td>
            </tr>`;
  }).join('');

  const data = `
  <tbody>
    ${output}
  </tbody>
  `

  return data
},

clone = function(address, event) {
  var target = event.target,
      targetText = target.innerHTML;

   address.setAttribute("value", targetText);
},

sortRows = function(td, tr, inputValue) {
  if (td) {
    if(td.innerHTML.indexOf(inputValue) > -1 ) {
      tr.style.display = ""
    } else {
      tr.style.display = "none"
    }
  }
}

insertTbody = function(json) {
  const table = document.getElementById("pivot"),
        thead = document.getElementById("thead"),
        form = document.forms["filter"],
        address = form.elements["address"],
        select = form.elements["filter-by"];


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


  form.addEventListener("submit", function(event) {
    event.preventDefault();
    const selectIndex = select.options[select.selectedIndex].text,
          inputValue = address.value,
          tr = document.getElementsByTagName("tr");

      if ( selectIndex === "Destination" ) {
        for(var i = 0; i < tr.length; i++) {
          var td = tr[i].getElementsByTagName("td")[0];
          sortRows(td, tr[i], inputValue)
        }
      } else {
        for(var i = 0; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[1];

            sortRows(td, tr[i], inputValue)
        }
      }
  })

}


request()
