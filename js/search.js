async function loadSearchResult() {
  $.ajax({
    url: `https://climateapi.williamsongshy.repl.co/station/find?name=${getQueryVariable(
      "name"
    )}`,
    success: (result) => {
      $("#result-loading").remove();
      var station_table_data = "";
      for (let x of result) {
        station_table_data += `<tr><td data-label=\"country\">${x.country}</td>\
                <td data-label=\"id\"><a href=\"index.html?station_id=${x.id}\">${x.id}</a></td>\
                <td data-label=\"lat\">${x.lat}</td>\
                <td data-label=\"lon\">${x.lon}</td>\
                <td data-label=\"name\">${x.name}</td>\
                `;
      }
      $("#result").append(
        `<table class=\"ui celled table\">\
                 <thead>\
                   <tr><th>country</th>\
                   <th>id</th>\
                   <th>latitude</th>\
                   <th>longitude</th>\
                   <th>name</th>\
                 </tr></thead>\
                 <tbody>\
                 ${station_table_data}\
                 </tbody>\
                 </table>
                 `
      );
    }
  });
}
async function loadView() {
  $("#search").click(() => {
    console.log("new url:", `./?name=${$("#name").val()}`);
    window.location.href = `./?name=${$("#name").val()}`;
  });
}
$(document).ready(() => {
  console.log(
    "search url:",
    `https://climateapi.williamsongshy.repl.co/station/find?name=${getQueryVariable(
      "name"
    )}`
  );
  loadSearchResult();
  loadView();
});
