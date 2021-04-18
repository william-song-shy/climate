function getLocation() {
    return new Promise((resolve, reject) => {
        try {
            window.navigator.geolocation.getCurrentPosition(position => resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }));
        }
        catch (e) {
            reject(e);
        }
    });
}
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return undefined;
}
async function loadLocation() {
    var loc = {
      lat:getQueryVariable("lat"),
      lon:getQueryVariable("lon")
    };
    if(loc.lat == undefined || loc.lon ==undefined)loc=getLocation();
    console.log(loc.lat);
    console.log(loc.lon);
    $("#lat").val(loc.lat);
    $("#lon").val(loc.lon);
    $.ajax({
        url: `https://climateapi.williamsongshy.repl.co/point/climate?lat=${parseInt(loc.lat)}&lon=${parseInt(loc.lon)}`,
        success: result => {
            console.log(result);
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
                   <td data-label=\"country\">${result.country}</td>\
                   <td data-label=\"koppen type\">${result.koppentype}</td>\
                 </tr>\
               </tbody>\
             </table>`);
             var month_table_data="";
             for(let x of result.data){
                month_table_data+=
                 `<tr><td data-label=\"month\">${x.month}</td>\
                 <td data-label=\"prcp\">${x.prcp}</td>\
                 <td data-label=\"pres\">${x.pres}</td>\
                 <td data-label=\"tavg\">${x.tavg}</td>\
                 <td data-label=\"tmax\">${x.tmax}</td>\
                 <td data-label=\"tmin\">${x.tmin}</td>\
                 <td data-label=\"tsun\">${x.tsun}</td></tr>\
                 `
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
             var station_table_data="";
             for(let x of result.nearby_stations){
                station_table_data+=
                `<tr><td data-label=\"country\">${x.country}</td>\
                <td data-label=\"id\">${x.id}</td>\
                <td data-label=\"lat\">${x.lat}</td>\
                <td data-label=\"lon\">${x.lon}</td>\
                <td data-label=\"name\">${x.name}</td>\
                `
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
    $('.ui.form').form({
        on: 'blur',
        fields: {
            latitude: {
              identifier  : 'lat',
              rules: [
                {
                  type   : 'integer[-180..180]',
                  prompt : 'Please enter an integer value in [-180..180]'
                }
              ]
            },
            longitude:{
                identifier  : 'lon',
                rules: [
                  {
                    type   : 'integer[-90..90]',
                    prompt : 'Please enter an integer value in [-90..90]'
                  }
                ]
            }
        }
    });
}
$(document).ready(() => {
        loadLocation();
        loadView();
    })