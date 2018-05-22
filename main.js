var weaponIndex = {};

var finished = [];

function init()
{
  showCategory("Daggers");
  showCategory("Straight Swords");
  showCategory("Greatswords");
  showCategory("Ultra Greatswords");
  showCategory("Curved Swords");
  showCategory("Curved Greatswords");
  showCategory("Katanas");
  showCategory("Thrusting Swords");
  showCategory("Axes");
  showCategory("Greataxes");
  showCategory("Hammers");
  showCategory("Great Hammers");
  showCategory("Fist & Claws");
  showCategory("Spears & Pikes");
  showCategory("Halberds");
  showCategory("Reapers");
  showCategory("Whips & Flails");
  // showCategory("Bows");
  // showCategory("Greatbows");
  // showCategory("Crossbows");
  // showCategory("Staves");
  // showCategory("Flames, Talismans & Chimes");
  
  document.getElementById("filter").addEventListener("input", updateFilter);
  document.getElementById("filter_switch").addEventListener("click", switchFilter);
  document.getElementById("clearFilter").addEventListener("click", clearFilter);
  
  var faces = document.querySelectorAll(".face");
  faces[Math.floor(Math.random() * faces.length)].classList.add("active");
  
  fetch("runs.txt").then(function(resp) {
    if (resp.ok)
    {
      return resp.text();
    }
    else document.getElementById("counter").textContent = ("Couldn't load runs.txt");
  }, function (reason)
  {
    document.getElementById("counter").textContent = "Couldn't load runs.txt with reason: " + reason;
  }).then(function (data)
  {
    var all = data.split("\n");
    var total = 0;
    var maxNG = "NG";
    
    function findName(name)
    {
      var lcase = name.toLowerCase();
      for (var w of weapons)
      {
        if (w.name == name || w.name.toLowerCase() == lcase) return w;
      }
      return null;
    }

    for (var entry of all)
    {
      if (entry.charAt(0) == "#") continue;
      var edata = /(.*) \((NG\+?[0-9]*)\) - (.*)(#d)?/.exec(entry);
      if (!edata)
      {
        if (entry.trim().length != 0) console.warn("Invalid entry: \"" + entry + "\"");
        continue;
      }
      var weapon = findName(edata[1]);
      if (weapon == null)
      {
        console.warn('couldn\'t find weapon with name "' + edata[1] + '"');
        continue;
      }
      var result = {
        weapon: weapon,
        finished: edata[3].indexOf("#d") == -1,
        user: edata[3],
        ng: edata[2]
      };
      if (!weapon.attempts) weapon.attempts = [];
      weapon.attempts.push(result);
      
      if (!result.finished) result.user = result.user.substr(0, result.user.length-2);
      var wdiv = document.getElementById(weapon.id);
      if (result.finished && !wdiv.classList.contains("finished"))
      {
        weapon.finished = true;
        wdiv.classList.add("finished");
        total++;
        if (result.ng > maxNG) maxNG = result.ng;
      }
      
      var div = document.createElement("div");
      div.classList.add("attempt");
      div.textContent = result.user + " (" + result.ng + (result.finished ? ")" : ", died)");
      wdiv.appendChild(div);
      finished.push(result);
      
      if (location.hash == "#completed" || location.hash == "#finished") switchFilter(null, 1);
      else if (location.hash == "#unfinished" || location.hash == "#incomplete") switchFilter(null, 2);
    }
    
    document.getElementById("counter").textContent = "Weapons finished: " + total + "; Top cycle: " + maxNG.toLowerCase();
    
    for (var c of Array.from(document.querySelectorAll(".category")))
    {
      c.addEventListener("click", goUp);
    }
    
  });
}

// Init: Create category listing.
function showCategory(category)
{
  var root = document.querySelector("#weapons");
  
  var header = document.createElement("h3");
  header.id = category;
  header.classList.add("category");
  header.textContent = category;
  root.appendChild(header);
  
  var container = document.createElement("div");
  container.classList.add("category-list");
  
  var list = weapons.filter( (v) => v.type == category );
  
  function makeWeapon(weapon, id, label, href, target)
  {
    var wdiv = document.createElement("div");
    wdiv.classList.add("weapon");
    wdiv.id = id;
    
    var anchor = document.createElement("a");
    anchor.href = href;
    if (target) anchor.target = target;
    
    var div = document.createElement("div");
    if (weapon.i == 0 && weapon.j == 0 && weapon.p == 0)
    {
      var img = new Image();
      img.src = weapon.icon;
      div.appendChild(img);
    }
    else
    {
      var cont = document.createElement("div");
      div.classList.add("custom");
      cont.classList.add("page" + weapon.p);
      cont.style.backgroundPositionX = (-weapon.i * 160) + "px";
      cont.style.backgroundPositionY = (-weapon.j * 160) + "px";
      div.appendChild(cont);
    }
    anchor.appendChild(div);
    div = document.createElement("div");
    div.classList.add("weapon-name");
    div.textContent = label;
    anchor.appendChild(div);
    wdiv.appendChild(anchor);
    return wdiv;
  }
  
  var cw = makeWeapon(list[0], "c_" + category, category, "#" + category);
  cw.classList.add("category-weapon");
  document.getElementById("category_list").appendChild(cw);
  
  for (var weapon of list)
  {
    weaponIndex[weapon.id] = weapon;
    var wdiv = makeWeapon(weapon, weapon.id, weapon.name, weapon.wiki, "_blank");
    wdiv.addEventListener("mouseover", showFextra);
    wdiv.addEventListener("mouseout", hideFextra);
    container.appendChild(wdiv);
  }
  root.appendChild(container);
}

function goUp(e)
{
  window.scrollTo({ top: 0, left: 0, behavior: "smooth"});
}

/* Filtering */

var filterMode = 0; // 0 = All, 1 = Finished, 2 = Unfinished
var filterDir = true; // true=right

function clearFilter(e)
{
  document.getElementById("filter").value = "";
  updateFilter();
}

function switchFilter(e, to)
{
  var t = document.getElementById("filter_caret");
  
  switch(filterMode)
  {
    case 0: break;
    case 1: t.classList.remove("center"); break;
    case 2: t.classList.remove("right"); break;
  }
  
  if (to !== undefined)
  {
    filterMode = to;
  }
  else if (t == e.target)
  {
    if (filterDir)
    {
      filterMode++;
      if (filterMode == 3)
      {
        filterMode = 1;
        filterDir = false;
      }
    }
    else
    {
      filterMode--;
      if (filterMode == -1)
      {
        filterMode = 1;
        filterDir = true;
      }
    }
  }
  else
  {
    var old = filterMode;
    filterMode = Math.floor((e.offsetX) / 60 * 3);
    console.log(filterMode);
    filterDir = old < filterMode;
  }
  
  var label;
  
  switch(filterMode)
  {
    case 0: label = "All weapons"; break;
    case 1: label = "Finished only"; t.classList.add("center"); break;
    case 2: label = "Unfinished only"; t.classList.add("right"); break;
  }
  
  document.getElementById("switch_label").textContent = label;
  updateFilter();
}

function shouldShow(w)
{
  return filterMode == 0 || (w.finished ? (filterMode == 1) : (filterMode == 2));
}

function updateFilter(e)
{
  var v = document.getElementById("filter").value;
  
  if (v == "")
  {
    document.querySelector(".filter-container").classList.remove("active");
    for (var wdiv of Array.from(document.querySelectorAll(".weapon:not(.category-weapon)")))
    {
      wdiv.classList.remove("filter-show");
      if (shouldShow(weaponIndex[wdiv.id]))
      {
        wdiv.classList.remove("filter-hide");
      }
      else
      {
        wdiv.classList.add("filter-hide");
      }
    }
    for (var cat of Array.from(document.querySelectorAll(".category")))
    {
      cat.classList.remove("filter-show");
      cat.classList.remove("filter-hide");
    }
    return;
  }
  
  document.querySelector(".filter-container").classList.add("active");
  
  function filterScan(w)
  {
    if (w.name.toLowerCase().indexOf(v) != -1) return true;
    if (w.attempts)
    {
      for (var att of w.attempts) if (att.user.toLowerCase().indexOf(v) != -1) return true;
    }
  }
  
  v = v.toLowerCase();
  var cats = {};
  for (var w of weapons)
  {
    var wdiv = document.getElementById(w.id);
    if (wdiv == null) continue;
    if (!cats[w.type]) cats[w.type] = 0;
    if (filterScan(w) && shouldShow(w))
    {
      cats[w.type]++;
      wdiv.classList.add("filter-show");
      wdiv.classList.remove("filter-hide");
    }
    else
    {
      wdiv.classList.add("filter-hide");
      wdiv.classList.remove("filter-show");
    }
  }
  for (var k in cats)
  {
    var cat = document.getElementById(k);
    if (cats[k] == 0) 
    {
      cat.classList.add("filter-hide");
      cat.classList.remove("filter-show");
    }
    else
    {
      cat.classList.add("filter-show");
      cat.classList.remove("filter-hide");
    }
  }
  
}

/* Fextralife data fetching */

var shouldShowFextra = false;
var hideTimer;
function showFextra(e)
{
  var weapon = weaponIndex[e.currentTarget.id];
  shouldShowFextra = e.currentTarget;
  var fi = document.getElementById("fextraInfo");
  var rect = e.currentTarget.getBoundingClientRect();
  if (!fi.classList.contains("shown"))
  {
    fi.classList.add("notransition");
    requestAnimationFrame(enableFextraTransition);
  }
  fi.style.left = (rect.x + rect.width / 2) + "px";
  fi.style.top = (rect.y + rect.height + window.scrollY) + "px";
  fi.classList.add("shown");
  // fi.querySelector("#fextra_str").textContent = "LO";
  // fi.querySelector("#fextra_dex").textContent = "AD";
  // fi.querySelector("#fextra_int").textContent = "IN";
  // fi.querySelector("#fextra_fai").textContent = "G.";
  fetchFextra(weapon).then(function(spec)
  {
    fi.querySelector("#fextra_str").textContent = spec.str;
    fi.querySelector("#fextra_dex").textContent = spec.dex;
    fi.querySelector("#fextra_int").textContent = spec.int;
    fi.querySelector("#fextra_fai").textContent = spec.fai;
  });
}

function enableFextraTransition()
{
  document.getElementById("fextraInfo").classList.remove("notransition");
}

function hideFextra(e)
{
  if (e.currentTarget == shouldShowFextra)
  {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hideFextraCB, 50);
    shouldShowFextra = false;
  }
}

function hideFextraCB()
{
  hideTimer = null;
  if (!shouldShowFextra)
  {
    var fi = document.getElementById("fextraInfo");
    fi.classList.remove("shown");
    fi.classList.remove("notransition");
  }
}

function fetchFextra(weapon)
{
  if (!weapon.spec)
  {
    return new Promise( function(resolve, reject)
    {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.open("GET", weapon.wiki);
      xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState == 4)
        {
          if (xhr.status == 200)
          {
            var doc = xhr.response;
            var tbl = doc.querySelector("#infobox,.infobox").querySelector("img[title='icon-strength_22.png']").parentElement.parentElement.parentElement.nextElementSibling;
            if (/[a-zA-Z]/.exec(tbl.textContent)) tbl = tbl.nextElementSibling;
            tbl = tbl.children;
            // var tbl = doc.querySelector("#infobox .wiki_table").querySelector("tr:nth-child(13)").children;
            weapon.spec = {
              str: tbl[0].textContent == "0" ? "-" : tbl[0].textContent,
              dex: tbl[1].textContent == "0" ? "-" : tbl[1].textContent,
              int: tbl[2].textContent == "0" ? "-" : tbl[2].textContent,
              fai: tbl[3].textContent == "0" ? "-" : tbl[3].textContent
            };
            resolve(weapon.spec);
          }
          else reject(xhr.status);
        }
      });
      xhr.send();
    });
  }
  else
  {
    return new Promise( (resolve, reject) => resolve(weapon.spec) );
  }
}
  
// Dumping weapon specs. No more fextralife loading!
/*
var wi = 0;
function nw(spec)
{
  wi++;
  if (wi == weapons.length)
  {
    var str = "var weapons = [";
    for (var w of weapons)
    {
      var o = {
        id: w.id,
        p: w.p,
        i: w.i,
        j: w.j,
        name: w.name,
        type: w.type,
        wiki: w.wiki
      };
      o.spec = {
        str: w.spec.str.trim(),
        dex: w.spec.dex.trim(),
        int: w.spec.int.trim(),
        fai: w.spec.fai.trim()
      };
      if (w.icon) o.icon = w.icon;
      str += "\r\n  " + JSON.stringify(o) + ",";
    }
    str += "\r\n]";
    // console.log(str);
    return;
  }
  fetchFextra(weapons[wi]).then(nw, nw);
}
wi = -1;
nw();
*/

document.addEventListener("DOMContentLoaded", init);
