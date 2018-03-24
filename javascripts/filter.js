function request() {
  const request = new Request('https://achapokas.github.io/data-store/javascripts/traffic_bytes.json');

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Cannot locate ${request} file.`);
      }
    })
    .then(response => {
      parseObject(response)
    })
}
