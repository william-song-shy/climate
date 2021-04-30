async function loadLocation() {
  var loc = {
    lat: getQueryVariable("lat"),
    lon: getQueryVariable("lon")
  };
  if (loc.lat == undefined || loc.lon == undefined) loc = await getLocation();
  console.log("lat:", loc.lat);
  console.log("lon:", loc.lon);
  $("#lat").val(parseFloat(loc.lat));
  $("#lon").val(parseFloat(loc.lon));
  let station_id = getQueryVariable("station_id");
  console.log(
    "request url:",
    station_id == undefined
      ? `https://climateapi.williamsongshy.repl.co/point/climate?lat=${parseFloat(
          loc.lat
        )}&lon=${parseFloat(loc.lon)}`
      : `https://climateapi.williamsongshy.repl.co/station/climate?id=${station_id}`
  );
  $.ajax({
    url:
      station_id == undefined
        ? `https://climateapi.williamsongshy.repl.co/point/climate?lat=${parseFloat(
            loc.lat
          )}&lon=${parseFloat(loc.lon)}`
        : `https://climateapi.williamsongshy.repl.co/station/climate?id=${station_id}`,
    success: (result) => {
      if (getQueryVariable("station_id") != undefined) {
        $("#result").append(
          `<h4>station ${result.name} (id:${result.id})</h4>`
        );
      }
      $("#result").append(
        `<table class=\"ui celled table\">\
               <thead>\
                 <tr><th>climate type</th>\
                 <th>country</th>\
                 <th>koppen type</th>\
               </tr></thead>\
               <tbody>\
                 <tr>\
                   <td data-label=\"climate type\">${result.chinesetype}</td>\
                   <td data-label=\"country\"><img src="https://flagcdn.com/${result.country.toLowerCase()}.svg" width="16">${
          result.country
        }</td>\
                   <td data-label=\"koppen type\">${result.koppentype}</td>\
                 </tr>\
               </tbody>\
             </table>`
      );
      $("#result-loading").remove();
      var month_table_data = "";
      for (let x of result.data) {
        month_table_data += `<tr><td data-label=\"month\">${x.month}</td>\
                 <td data-label=\"prcp\" style=\"${precipitation_color(
                   x.prcp
                 )}\">${x.prcp}</td>\
                 <td data-label=\"pres\">${x.pres}</td>\
                 <td data-label=\"tavg\" style=\"${temperature_color(
                   x.tavg
                 )}\">${x.tavg}</td>\
                 <td data-label=\"tmax\" style=\"${temperature_color(
                   x.tmax
                 )}\">${x.tmax}</td>\
                 <td data-label=\"tmin\" style=\"${temperature_color(
                   x.tmin
                 )}\">${x.tmin}</td>\
                 <td data-label=\"tsun\">${x.tsun}</td></tr>\
                 `;
      }
      $("#month").append(
        `<table class=\"ui celled table\">\
                 <thead>\
                   <tr><th>month</th>\
                   <th>prcp</th>\
                   <th>pres</th>\
                   <th>tavg</th>\
                   <th>tmax</th>\
                   <th>tmin</th>\
                   <th>tsun</th>\
                 </tr></thead>\
                 <tbody>\
                 ${month_table_data}\
                 </tbody>\
                 </table>
                 `
      );
      $("#month-loading").remove();
      if (getQueryVariable("station_id") != undefined) {
        $("#station-title").remove();
        $("#station-loading").remove();
        return;
      }
      $("#station-loading").remove();
      var station_table_data = "";
      for (let x of result.nearby_stations) {
        station_table_data += `<tr><td data-label=\"country\">${x.country}</td>\
                <td data-label=\"id\"><a href=\"./?station_id=${x.id}\">${x.id}</a></td>\
                <td data-label=\"lat\">${x.lat}</td>\
                <td data-label=\"lon\">${x.lon}</td>\
                <td data-label=\"name\">${x.name}</td>\
                `;
      }
      $("#station").append(
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
  $(".ui.form").form({
    on: "blur",
    fields: {
      latitude: {
        identifier: "lat",
        rules: [
          {
            type: "number[-90..90]",
            prompt: "纬度须在-90和90之间"
          }
        ]
      },
      longitude: {
        identifier: "lon",
        rules: [
          {
            type: "number[-180..180]",
            prompt: "经度必须在-180和180之间"
          }
        ]
      }
    }
  });
}
$(document).ready(() => {
  loadLocation();
  loadView();
});
