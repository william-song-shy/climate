var loc = {
  lat: undefined,
  lon: undefined
};
var mymap;
var mks;
async function loadLocation() {
  if (!loc.lat || !loc.lon)
  {
    if(getQueryVariable("station_id")){
      loc.lat = loc.lon = 0;  
      $("#lat").attr("disabled","");
      $("#lon").attr("disabled","");
      $("#submit").css("display","none");
      $("#copylatlon").css("display","");
    }
    else {
      $("#allresult").css("display","none");
      return;
    }
  }
  $("#allresult").css("display","");
  $("#result").html("");
  $("#month").html("");
  $("#station").html("");
  $("#station-loading").css("display","");
  $("#month-loading").css("display","");
  $("#result-loading").css("display","");
  //var loc = {
  //  lat: getQueryVariable("lat"),
  //  lon: getQueryVariable("lon")
  //};
  //if (loc.lat == undefined || loc.lon == undefined) loc = await getLocation();
  let station_id = getQueryVariable("station_id");
  mks.remove();
  mks=L.layerGroup();
  if (getQueryVariable("station_id") == undefined)
  {
    console.log("lat:", loc.lat);
    console.log("lon:", loc.lon);
    $("#lat").val(parseFloat(loc.lat));
    $("#lon").val(parseFloat(loc.lon));
    mymap .setView([loc.lat, loc.lon], 9);
    var marker = L.marker([loc.lat, loc.lon]);
      marker.bindPopup(`${loc.lat}, ${loc.lon}`).openPopup();
      mks.addLayer(marker).addTo(mymap);
  }
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
        loc.lat=result.lat;
        loc.lon=result.lon;
        $("#lat").val(parseFloat(loc.lat));
        $("#lon").val(parseFloat(loc.lon));
        var clipboard = new ClipboardJS('#copylatlon', {
          text: function() {
              //console.log(loc)
              $("#copylatlon").text("复制成功");
              setTimeout(function(){$("#copylatlon").text("复制经纬度信息");},1000);
              return `(${loc.lat},${loc.lon})`;
          }
      });
        mymap .setView([loc.lat, loc.lon], 9);
        var marker = L.marker([loc.lat, loc.lon]);
          marker.bindPopup(`${result.name} (id:${result.id})`).openPopup();
          mks.addLayer(marker).addTo(mymap);
        $("#result").append(
          `<h4>station ${result.name} (id:${result.id})</h4>`
        );
      }
      $("#result").append(
        `<table class=\"ui celled table\">\
               <thead>\
                 <tr><th>气候类型</th>\
                 <th>国家/地区</th>\
                 <th>柯本气候类型</th>\
               </tr></thead>\
               <tbody>\
                 <tr>\
                   <td data-label=\"climate type\">${result.chinesetype}气候</td>\
                   <td data-label=\"country\"><img src="https://meteostat.net/files/img/flags/4x3/${result.country.toLowerCase()}.svg" width="16">  ${
          ISO3166_to_cn(result.country)
        }</td>\
                   <td data-label=\"koppen type\">${result.koppentype}</td>\
                 </tr>\
               </tbody>\
             </table>`
      );
      $("#result-loading").css("display","none");
      var month_table_data_prcp = "<td style=\"background: #f9fafb;font-weight:bold;\">月总降水量</td>",
        month_table_data_tavg = "<td style=\"background: #f9fafb;font-weight:bold;\">月平均气温</td>",
        month_table_data_tmin = "<td style=\"background: #f9fafb;font-weight:bold;\">月最低气温</td>",
        month_table_data_tmax = "<td style=\"background: #f9fafb;font-weight:bold;\">月最高气温</td>";
      for (let x of result.data)
      {
        month_table_data_prcp+=`<td data-label=\"prcp\" style=\"${precipitation_color(
          x.prcp
        )}\">${x.prcp} mm</td>\
        `;
        month_table_data_tavg+=`<td data-label=\"tavg\" style=\"${temperature_color(
          x.tavg
        )}\">${x.tavg}​ ℃</td>\
        `;
        month_table_data_tmin+=`<td data-label=\"tmin\" style=\"${temperature_color(
          x.tmin
        )}\">${x.tmin}​ ℃</td>\
        `;
        month_table_data_tmax+=`<td data-label=\"tmax\" style=\"${temperature_color(
          x.tmax
        )}\">${x.tmax}​ ℃</td>\
        `;
        
      }
      /*for (let x of result.data) {
        month_table_data += `<tr><td data-label=\"month\">${x.month}</td>\
                 <td data-label=\"prcp\" style=\"${precipitation_color(
                   x.prcp
                 )}\">${x.prcp} mm</td>\
                 <td data-label=\"pres\">${x.pres}</td>\
                 <td data-label=\"tavg\" style=\"${temperature_color(
                   x.tavg
                 )}\">${x.tavg}​ ℃</td>\
                 <td data-label=\"tmax\" style=\"${temperature_color(
                   x.tmax
                 )}\">${x.tmax} ​℃</td>\
                 <td data-label=\"tmin\" style=\"${temperature_color(
                   x.tmin
                 )}\">${x.tmin} ​℃</td>\
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
      );*/
      $("#month").append(
        `<table class=\"ui celled table\" style=\"text-align: center;\">\
                 <thead>\
        <tr><th> 月份 </th>
        <th> 1月 </th>
        <th> 2月 </th>
        <th> 3月 </th>
        <th> 4月 </th>
        <th> 5月 </th>
        <th> 6月 </th>
        <th> 7月 </th>
        <th> 8月 </th>
        <th> 9月 </th>
        <th> 10月 </th>
        <th> 11月 </th>
        <th> 12月 </th></tr></thead>
        <tbody>\
        <tr> ${month_table_data_prcp} </tr>\
        <tr> ${month_table_data_tavg} </tr>\
        <tr> ${month_table_data_tmin} </tr>\
        <tr> ${month_table_data_tmax} </tr>\
        </tbody>\ 
        </table>
        `
      )
      $("#month-loading").css("display","none");
      if (getQueryVariable("station_id") != undefined) {
        $("#station-title").remove();
        $("#station-loading").remove();
        return;
      }
      $("#station-loading").css("display","none");
      var station_table_data = "";
      for (let x of result.nearby_stations) {
        let marker = L.marker([x.lat, x.lon]);
        marker.bindPopup(`${x.id} ${x.name}`).openPopup();
        mks.addLayer(marker).addTo(mymap);
        station_table_data += `<tr><td data-label=\"country\"><img src="https://meteostat.net/files/img/flags/4x3/${x.country.toLowerCase()}.svg" width="16">  ${ISO3166_to_cn(x.country)}</td>\
                <td data-label=\"id\"><a href=\"./?station_id=${x.id}\">${x.id}</a></td>\
                <td data-label=\"lat\">${x.lat}</td>\
                <td data-label=\"lon\">${x.lon}</td>\
                <td data-label=\"name\">${x.name}</td>\
                `;
      }
      $("#station").append(
        `<table class=\"ui celled table\">\
                 <thead>\
                   <tr><th>国家/地区</th>\
                   <th>id</th>\
                   <th>纬度</th>\
                   <th>经度</th>\
                   <th>名称</th>\
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
  /*$("#search").click(() => {
    console.log("new url:", `./search.html?name=${$("#name").val()}`);
    window.location.href = `./search.html?name=${$("#name").val()}`;
  });*/
  $('#search')
  .search({
    minCharacters : 3,
    apiSettings: {
      url: 'https://climateapi.williamsongshy.repl.co/station/find?name={query}',
      onResponse: function(resp){
        console.log(resp,Object.values(resp));
        var
        response = {
          results : []
        };
        $.each(Object.values(resp),function(index,item){
          console.log(item.id);
          response.results.push({
            title : item.name,
            description : `位于${ISO3166_to_cn(item.country)}境内，(${item.lat},${item.lon}),id为${item.id}`,
            url : `./?station_id=${item.id}`
          });
        });
        return response;
      }
    }
  });
}
function onsubmitloc()
{
  if (getQueryVariable("station_id") != undefined)
    return false;
  loc.lat=$("#lat").val()
  loc.lon=$("#lon").val()
  loadLocation();
  return false;
}
function fix_lon (val)
{
  val=val%360
	if (val<-180)
		val+=360
	else if  (val>180)
		val-=360
	return val
}
$(document).ready(() => {
  mymap = L.map('map').setView([35,115], 4);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic29uZ2hvbmd5aSIsImEiOiJja25jdDdjZG4xM25iMnVvb2NjbDl3YjMwIn0.PJZgJQmBgR_g-vsSD7uKFA'
    }).addTo(mymap);
  function onMapClick(e) {
      if (confirm(`Do you want to see the climate of (${e.latlng.lat},${fix_lon(e.latlng.lng)})` ))
      {
        loc.lat=e.latlng.lat;
        loc.lon=fix_lon(e.latlng.lng);
        loadLocation();
      }
  }
  if (getQueryVariable("station_id") == undefined)
    mymap.on('click', onMapClick);
  mks=L.layerGroup();
  loadLocation();
  loadView();
});
