function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return undefined;
}
async function loadView(){
    if(getQueryVariable("id")!=undefined){
        ajax({
            url:`https://climateapi.williamsongshy.repl.co/station/climate?id=${getQueryVariable("id")}`,
            success: result => {
                var station_table_data="";
                for(let x of [result]){
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
}
$(document).ready(() => {
    loadView();
})