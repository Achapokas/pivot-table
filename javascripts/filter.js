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
      insertTable(json)
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

cloneValue = function(address, event) {
  const target = event.target,
        targetText = target.innerHTML;

   address.setAttribute("value", targetText);
},

filterRows = function(data, row, value) {
  if (data) {
    if(value === data.innerHTML) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  }
},

storesFilterParams = function(table, select, address) {
  const index = select.options[select.selectedIndex].text,
        value = address.value,
        row = table.getElementsByTagName("tr");

    if ( index === "Destination" ) {
      for(let i = 0; i < row.length; i++) {
        var data = row[i].getElementsByTagName("td")[0];

        filterRows(data, row[i], value, i)
      }
    } else {
      for(let i = 0; i < row.length; i++) {
          var data = row[i].getElementsByTagName("td")[1];

        filterRows(data, row[i], value, i)
      }
    }
},

removesFilterParams = function(tr) {
  for (let i = 0; i < tr.length; i++) {
    tr[i].removeAttribute("style")
  }
},

sessionFilterParams = function() {},

filterTemplate = function(select, address) {
  const index = select.options[select.selectedIndex].text,
        value = address.value,
        aside = document.querySelector("aside");
        asideLinks = `<a href="#" data-option="${index}">${value}</a>`;

  aside.insertAdjacentHTML('beforeEnd', asideLinks);
}

test = function(tr) {
  for(var i = 0; i < tr.length; i++) {
    var style = sessionStorage.getItem('style' + [i]);

    tr[i].style.display = style
  }
},

init = function() {
const table = document.getElementById("pivot"),
      tr = table.getElementsByTagName("tr"),
      form = document.forms["filter"],
      address = form.elements["address"],
      select = form.elements["filter-by"],
      reset = form.elements["reset"];

  table.addEventListener("click", function(event){ cloneValue( address, event) })

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    storesFilterParams(table, select, address)
    filterTemplate(select, address)
  })

  reset.addEventListener("click", function(event){ event.preventDefault(); removesFilterParams(tr) })


  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();

    for(var i = 0; i < tr.length; i++) {
      sessionStorage.setItem('style' + [i], tr[i].style.display)
    }
  });

  window.addEventListener("DOMContentLoaded", test(tr), false);

  // window.onload = function() {
  //   for(var i = 0; i < tr.length; i++) {
  //     var style = sessionStorage.getItem('style' + [i]);

  //     tr[i].style.display = style
  //   }
  // }
},

recentFilters = function() {
  var targetNode = document.getElementById('aside');
  var config = { childList: true };

  var callback = function(mutationsList) {
      for(var mutation of mutationsList) {
          if (mutation.type == 'childList') {
            var childNodes = targetNode.querySelectorAll('a'),
            table = document.getElementById("pivot"),
            form = document.forms["filter"],
            address = form.elements["address"],
            select = form.elements["filter-by"];


            targetNode.addEventListener('click', function(event){
              event.preventDefault();
              const target = event.target,
                    targetText = target.innerHTML,
                    targetAttribute = target.getAttribute("data-option");

                    cloneValue(address, event)

                    storesFilterParams(table, select, address)
              })
          }
      }
  };

  var observer = new MutationObserver(callback);

  observer.observe(targetNode, config);
},

insertTable = function(json) {
  const table = document.getElementById("pivot");

  var results = [];

  for(var i = 0; i < json.length; i++){
    const result = json[i].result,
          resultDest = result["All_Traffic.dest"]

          results.push(result)
  }

  table.insertAdjacentHTML('beforeEnd', seedTable(results));
}

request()
init()
recentFilters()
