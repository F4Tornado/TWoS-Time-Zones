let info;
let players;
let thisI = "UTC";

function gen(data) {
  info = data;
  console.log(info);
  players = [];
  for (let i = 0; i < info.length; i++) {
    players.push(new PlayerZone(i))
  }
  requestAnimationFrame(run);
}

function run() {
  for (let i = 0; i < players.length; i++) {
    players[i].show()
  }
  requestAnimationFrame(run);
}

const PlayerZone = function (i) {
  this.info = info[i];
  this.i = i;
  this.elem = $(`<div onclick="thisI = ${this.i}">
    <h1>${this.info.name}</h1>
    <h1 id="time${i}"></h1>
  </div>`)
  $("#list").append(this.elem);
  this.elem.css({
    position: "absolute",
    top: `${10*i}vh`,
    left: "0vw",
    height: "10vh",
    width: "100vw",
    fontFamily: "Ubuntu, sans-serif",
    border: `${1/100}vw solid #000000`
  })
  this.show = () => {
    $("#time" + this.i).html(this.time());
    $("#time" + this.i).css({
      position: "absolute",
      left: "15vw",
      top: "0vh"
    })
  }
  this.time = () => {
    let ret;
    if (thisI != "UTC") {
      ret = players[thisI].info.utc * -1
    } else {
      ret = 0;
    }
    let now = new Date();
    if (this.info.DST) {
      let check = dateCheck(`${this.info.DST.startDay}/${this.info.DST.startMonth}/${now.getFullYear()}`, `${this.info.DST.endDay}/${this.info.DST.endMonth}/${now.getFullYear()}`, `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`);
      if (check) {
        ret += this.info.DST.change;
      }
    }
    ret += this.info.utc;
    ret += now.getHours();
    ret += now.getMinutes() / 60;
    let dmp = ret - Math.floor(ret)
    ret = Math.floor(ret);
    return `${ret}:${format(Math.floor(dmp*60), 00)}`;
  }
  this.changeI = () => {
    thisI = this.i
  }
}

function dateCheck(from, to, check) {

  var fDate, lDate, cDate;
  fDate = Date.parse(from);
  lDate = Date.parse(to);
  cDate = Date.parse(check);

  if ((cDate <= lDate && cDate >= fDate)) {
    return true;
  }
  return false;
}

function zero(n) {
  if (n < 10) {
    return parseInt("0"+n);
  }
  return n;
}

$.getJSON("ZoneInfo.json", gen);
